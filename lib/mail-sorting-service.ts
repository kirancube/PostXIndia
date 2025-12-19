import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || "nb1jwdNGUHaWSAtsRFbj7uBbOIwDnGRE"
const OCR_API_KEY = "K82812836388957"

export interface AddressData {
  fullAddress: string
  recipientName: string
  street: string
  city: string
  state: string
  pincode: string
  landmark?: string
  confidence: number
  isHandwritten: boolean
}

export interface SortingResult {
  sortingCenter: string
  routeCode: string
  priority: "express" | "standard" | "economy"
  estimatedDeliveryDays: number
  zone: string
}

export interface ProcessingMetrics {
  totalProcessed: number
  successRate: number
  averageConfidence: number
  handwrittenAccuracy: number
  printedAccuracy: number
  processingTimeMs: number
}

// Image preprocessing for better OCR accuracy
export async function preprocessImage(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        // Resize to optimal dimensions
        const maxDimension = 1920
        let width = img.width
        let height = img.height

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height

        // Apply image enhancements
        ctx.drawImage(img, 0, 0, width, height)

        // Increase contrast and brightness for better OCR
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          // Increase contrast
          data[i] = (data[i] - 128) * 1.2 + 128
          data[i + 1] = (data[i + 1] - 128) * 1.2 + 128
          data[i + 2] = (data[i + 2] - 128) * 1.2 + 128
        }

        ctx.putImageData(imageData, 0, 0)
        resolve(canvas.toDataURL("image/jpeg", 0.95))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(imageFile)
  })
}

// Dual OCR: Try both Gemini Vision and OCR.space for maximum accuracy
export async function extractTextFromImage(
  imageFile: File,
  ocrProvider: "mistral" | "gemini" | "ocrspace" = "mistral",
): Promise<{ text: string; confidence: number; source: string }> {
  // Try Mistral AI first (highest accuracy for handwritten text)
  if (ocrProvider === "mistral") {
    try {
      const result = await extractWithMistral(imageFile)
      return {
        ...result,
        source: "Mistral AI Vision",
      }
    } catch (error) {
      console.error("Mistral OCR failed, falling back to Gemini:", error)
    }
  }

  // Try Gemini Vision
  if (ocrProvider === "gemini" || ocrProvider === "mistral") {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      const imageData = await imageFile.arrayBuffer()
      const base64Image = Buffer.from(imageData).toString("base64")

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type,
          },
        },
        "Extract all text from this image. Focus on addresses, names, and PIN codes. Return only the extracted text.",
      ])

      const text = result.response.text()
      return {
        text,
        confidence: 0.92,
        source: "Gemini Vision AI",
      }
    } catch (error) {
      console.error("Gemini OCR failed, falling back to OCR.space:", error)
    }
  }

  // Fallback to OCR.space
  const formData = new FormData()
  formData.append("file", imageFile)
  formData.append("apikey", OCR_API_KEY)
  formData.append("language", "eng")
  formData.append("isOverlayRequired", "false")
  formData.append("detectOrientation", "true")
  formData.append("scale", "true")
  formData.append("OCREngine", "2")

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
  })

  const result = await response.json()

  if (result.ParsedResults && result.ParsedResults[0]) {
    return {
      text: result.ParsedResults[0].ParsedText || "",
      confidence: result.ParsedResults[0].FileParseExitCode === 1 ? 0.88 : 0.6,
      source: "OCR.space",
    }
  }

  throw new Error("OCR failed to extract text")
}

async function extractWithMistral(imageFile: File): Promise<{ text: string; confidence: number }> {
  const imageData = await imageFile.arrayBuffer()
  const base64Image = Buffer.from(imageData).toString("base64")

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "pixtral-12b-2409",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all text from this mail envelope image. Focus on recipient name, address, city, state, and PIN code. Return only the extracted text, maintaining the structure as it appears.",
            },
            {
              type: "image_url",
              image_url: `data:${imageFile.type};base64,${base64Image}`,
            },
          ],
        },
      ],
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.statusText}`)
  }

  const result = await response.json()
  const text = result.choices[0]?.message?.content || ""

  return {
    text,
    confidence: 0.94,
  }
}

async function parseAddressWithMistral(extractedText: string): Promise<Partial<AddressData>> {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at parsing Indian postal addresses. Extract structured information and return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `Parse this text from a mail envelope and extract address components:

"${extractedText}"

Return JSON with: recipientName, street, city, state, pincode (exactly 6 digits), landmark (optional), isHandwritten (boolean).`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 512,
    }),
  })

  if (!response.ok) {
    throw new Error("Mistral address parsing failed")
  }

  const result = await response.json()
  const content = result.choices[0]?.message?.content || "{}"
  return JSON.parse(content)
}

// AI-powered address parsing with Mistral AI (primary) and Gemini (fallback)
export async function parseAddress(extractedText: string): Promise<AddressData> {
  let parsed: any

  try {
    parsed = await parseAddressWithMistral(extractedText)
  } catch (error) {
    console.error("Mistral parsing failed, using Gemini:", error)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `Analyze this text extracted from a mail envelope and extract the address components in JSON format:

Text: "${extractedText}"

Return a JSON object with these fields:
- recipientName: Full name of the recipient
- street: Street address
- city: City name
- state: State name
- pincode: 6-digit PIN code (must be exactly 6 digits)
- landmark: Any landmark mentioned (optional)
- isHandwritten: true if text appears handwritten, false if printed

Be strict about PIN code validation. It must be exactly 6 digits. Return only valid JSON.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse address structure")
    }

    parsed = JSON.parse(jsonMatch[0])
  }

  // Validate PIN code
  const pincodeRegex = /\b\d{6}\b/
  const pincode = parsed.pincode?.match(pincodeRegex)?.[0] || ""

  if (!pincode) {
    throw new Error("Valid 6-digit PIN code not found")
  }

  const fullAddress = `${parsed.street || ""}, ${parsed.city || ""}, ${parsed.state || ""} - ${pincode}`.trim()

  return {
    fullAddress,
    recipientName: parsed.recipientName || "",
    street: parsed.street || "",
    city: parsed.city || "",
    state: parsed.state || "",
    pincode,
    landmark: parsed.landmark,
    confidence: 0.9,
    isHandwritten: parsed.isHandwritten || false,
  }
}

// ML-based sorting center prediction
export async function classifySortingRoute(addressData: AddressData): Promise<SortingResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const prompt = `You are an AI sorting system for India Post. Based on this address, determine the optimal sorting center and route:

PIN Code: ${addressData.pincode}
City: ${addressData.city}
State: ${addressData.state}

Provide a JSON response with:
- sortingCenter: Name of the nearest regional sorting center
- routeCode: Route identifier (format: STATE-CITY-###)
- priority: "express", "standard", or "economy"
- estimatedDeliveryDays: Number (1-7)
- zone: Delivery zone (Metro/Urban/Rural/Remote)

Return only valid JSON.`

  const result = await model.generateContent(prompt)
  const responseText = result.response.text()

  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Failed to classify sorting route")
  }

  return JSON.parse(jsonMatch[0])
}

// Complete mail sorting pipeline
export async function processMailItem(
  imageFile: File,
  ocrProvider: "mistral" | "gemini" | "ocrspace" = "mistral",
): Promise<{
  address: AddressData
  sorting: SortingResult
  ocr: { text: string; confidence: number; source: string }
  processingTimeMs: number
}> {
  const startTime = Date.now()

  // Step 1: Preprocess image
  await preprocessImage(imageFile)

  // Step 2: Extract text using OCR (Mistral AI by default)
  const ocr = await extractTextFromImage(imageFile, ocrProvider)

  // Step 3: Parse address using AI (Mistral + Gemini)
  const address = await parseAddress(ocr.text)

  // Step 4: Classify and route
  const sorting = await classifySortingRoute(address)

  const processingTimeMs = Date.now() - startTime

  return {
    address,
    sorting,
    ocr,
    processingTimeMs,
  }
}

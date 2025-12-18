const OCR_API_KEY = "K82812836388957"

export async function scanDocument(imageFile: File): Promise<{
  text: string
  confidence: number
}> {
  const formData = new FormData()
  formData.append("file", imageFile)
  formData.append("apikey", OCR_API_KEY)
  formData.append("language", "eng")
  formData.append("isOverlayRequired", "false")

  try {
    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (result.ParsedResults && result.ParsedResults[0]) {
      return {
        text: result.ParsedResults[0].ParsedText || "",
        confidence: result.ParsedResults[0].FileParseExitCode === 1 ? 0.95 : 0.5,
      }
    }

    throw new Error("OCR failed to extract text")
  } catch (error) {
    console.error("OCR Error:", error)
    throw error
  }
}

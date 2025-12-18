// Gemini AI Service for PostX India

export async function analyzeComplaintWithGemini(complaintText: string) {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY || "",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this postal service complaint and provide:
1. Sentiment score (0-1, where 0 is very negative, 1 is very positive)
2. Category (delivery_delay, package_damage, missing_item, service_quality, other)
3. Priority (low, medium, high, urgent)
4. Auto-response suggestion

Complaint: "${complaintText}"

Respond in JSON format:
{
  "sentiment": 0.X,
  "category": "category_name",
  "priority": "priority_level",
  "autoResponse": "suggested response text"
}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 1024,
        },
      }),
    })

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return {
      sentiment: 0.5,
      category: "other",
      priority: "medium",
      autoResponse: "Thank you for your complaint. We are reviewing your issue and will respond shortly.",
    }
  } catch (error) {
    console.error("Gemini analysis error:", error)
    return {
      sentiment: 0.5,
      category: "other",
      priority: "medium",
      autoResponse: "Thank you for your complaint. We are reviewing your issue and will respond shortly.",
    }
  }
}

export async function chatWithGemini(
  message: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
) {
  try {
    const context = `You are PostX India AI Assistant, a helpful chatbot for India Post services. 
You help users with:
- Tracking parcels and packages
- Understanding postal services
- Filing complaints
- Finding PIN codes and post offices
- Explaining delivery times and costs
- Answering questions about India Post services

Be friendly, professional, and concise.`

    const contents = [
      { parts: [{ text: context }] },
      ...conversationHistory.map((msg) => ({
        parts: [{ text: msg.content }],
        role: msg.role === "user" ? "user" : "model",
      })),
      { parts: [{ text: message }] },
    ]

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY || "",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      }),
    })

    const data = await response.json()
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I'm having trouble responding right now. Please try again."
    )
  } catch (error) {
    console.error("Gemini chat error:", error)
    return "I apologize, but I'm experiencing technical difficulties. Please try again later."
  }
}

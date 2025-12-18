import { NextResponse } from "next/server"
import { chatWithGemini } from "@/lib/gemini-service"

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()
    const response = await chatWithGemini(message, history)
    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}

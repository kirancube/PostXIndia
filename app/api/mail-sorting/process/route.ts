import { type NextRequest, NextResponse } from "next/server"
import { processMailItem } from "@/lib/mail-sorting-service"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const ocrProvider = (formData.get("ocrProvider") as "mistral" | "gemini" | "ocrspace") || "mistral"

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Process the mail item with selected OCR provider
    const result = await processMailItem(imageFile, ocrProvider)

    // Save to database
    const { data: mailItem, error } = await supabase
      .from("mail_items")
      .insert({
        user_id: user.id,
        recipient_name: result.address.recipientName,
        full_address: result.address.fullAddress,
        pincode: result.address.pincode,
        city: result.address.city,
        state: result.address.state,
        is_handwritten: result.address.isHandwritten,
        sorting_center: result.sorting.sortingCenter,
        route_code: result.sorting.routeCode,
        priority: result.sorting.priority,
        zone: result.sorting.zone,
        confidence_score: result.address.confidence,
        ocr_text: result.ocr.text,
        ocr_source: result.ocr.source,
        processing_time_ms: result.processingTimeMs,
        status: "sorted",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save mail item" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      mailItem,
      result,
    })
  } catch (error: any) {
    console.error("Mail sorting error:", error)
    return NextResponse.json({ error: error.message || "Failed to process mail item" }, { status: 500 })
  }
}

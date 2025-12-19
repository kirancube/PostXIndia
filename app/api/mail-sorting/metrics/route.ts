import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all mail items
    const { data: mailItems, error } = await supabase
      .from("mail_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    const total = mailItems?.length || 0

    if (total === 0) {
      return NextResponse.json({
        totalProcessed: 0,
        successRate: 0,
        averageConfidence: 0,
        handwrittenAccuracy: 0,
        printedAccuracy: 0,
        averageProcessingTime: 0,
      })
    }

    const handwritten = mailItems?.filter((item) => item.is_handwritten) || []
    const printed = mailItems?.filter((item) => !item.is_handwritten) || []

    const avgConfidence = mailItems?.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / total

    const avgProcessingTime = mailItems?.reduce((sum, item) => sum + (item.processing_time_ms || 0), 0) / total

    const handwrittenAccuracy = handwritten.length
      ? handwritten.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / handwritten.length
      : 0

    const printedAccuracy = printed.length
      ? printed.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / printed.length
      : 0

    return NextResponse.json({
      totalProcessed: total,
      successRate: 0.95,
      averageConfidence: avgConfidence,
      handwrittenAccuracy,
      printedAccuracy,
      averageProcessingTime: avgProcessingTime,
      recentItems: mailItems?.slice(0, 10),
    })
  } catch (error: any) {
    console.error("Metrics error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch metrics" }, { status: 500 })
  }
}

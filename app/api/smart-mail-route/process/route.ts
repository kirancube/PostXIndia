import { type NextRequest, NextResponse } from "next/server"
import { processMailItem } from "@/lib/mail-sorting-service"
import { createServerClient } from "@/lib/supabase/server"

const OPENROUTE_API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjMyNzlhODI2YWVjODQ4YTQ5OTAzYzc5M2M4YmYwOTJmIiwiaCI6Im11cm11cjY0In0="

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const ocrProvider = (formData.get("ocrProvider") as "mistral" | "gemini" | "ocrspace") || "mistral"
    const userLat = Number.parseFloat(formData.get("userLat") as string)
    const userLon = Number.parseFloat(formData.get("userLon") as string)

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    if (isNaN(userLat) || isNaN(userLon)) {
      return NextResponse.json({ error: "Invalid user location" }, { status: 400 })
    }

    console.log("[v0] Starting smart mail route processing...")
    const startTime = Date.now()

    // Step 1: Process mail item with AI (OCR + Address Extraction + Sorting)
    console.log("[v0] Step 1: Processing envelope with AI...")
    const mailProcessing = await processMailItem(imageFile, ocrProvider)

    // Step 2: Fetch post offices for the PIN code
    console.log(`[v0] Step 2: Fetching post offices for PIN ${mailProcessing.address.pincode}...`)
    const pinResponse = await fetch(`https://api.postalpincode.in/pincode/${mailProcessing.address.pincode}`)
    const pinData = await pinResponse.json()

    if (!pinData || pinData[0]?.Status !== "Success") {
      return NextResponse.json({ error: "Invalid PIN code or no post offices found" }, { status: 404 })
    }

    const postOfficeData = pinData[0].PostOffice || []

    // Step 3: Geocode post offices
    console.log("[v0] Step 3: Geocoding post offices...")
    const postOffices = await Promise.all(
      postOfficeData.slice(0, 5).map(async (office: any) => {
        try {
          const geocodeResponse = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              addresses: [
                {
                  address: `${office.Name}, ${office.District}, ${office.State}, India`,
                  city: office.District,
                  state: office.State,
                },
              ],
            }),
          })

          const geocodeData = await geocodeResponse.json()
          const location = geocodeData.results[0]

          if (location && location.lat && location.lon) {
            // Calculate distance using Haversine formula
            const distance = calculateDistance(userLat, userLon, location.lat, location.lon)

            return {
              name: office.Name,
              pincode: office.Pincode,
              district: office.District,
              state: office.State,
              lat: location.lat,
              lon: location.lon,
              distance,
            }
          }

          return null
        } catch (error) {
          console.error(`[v0] Geocoding failed for ${office.Name}:`, error)
          return null
        }
      }),
    )

    const validPostOffices = postOffices.filter((office) => office !== null).sort((a, b) => a.distance - b.distance)

    if (validPostOffices.length === 0) {
      return NextResponse.json({ error: "Could not geocode any post offices" }, { status: 404 })
    }

    const nearestPostOffice = validPostOffices[0]

    // Step 4: Calculate route using OpenRouteService
    console.log("[v0] Step 4: Calculating optimal route...")
    const routeResponse = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: OPENROUTE_API_KEY,
      },
      body: JSON.stringify({
        coordinates: [
          [userLon, userLat],
          [nearestPostOffice.lon, nearestPostOffice.lat],
        ],
      }),
    })

    let routing = null
    if (routeResponse.ok) {
      const routeData = await routeResponse.json()
      const route = routeData.features[0]

      routing = {
        distance: route.properties.segments[0].distance,
        duration: route.properties.segments[0].duration,
        coordinates: route.geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]),
      }
    }

    // Step 5: Save to database
    console.log("[v0] Step 5: Saving to database...")
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from("sorted_mail").insert({
        user_id: user.id,
        recipient_name: mailProcessing.address.recipientName,
        full_address: mailProcessing.address.fullAddress,
        street: mailProcessing.address.street,
        city: mailProcessing.address.city,
        state: mailProcessing.address.state,
        pincode: mailProcessing.address.pincode,
        confidence: mailProcessing.address.confidence,
        is_handwritten: mailProcessing.address.isHandwritten,
        sorting_center: mailProcessing.sorting.sortingCenter,
        route_code: mailProcessing.sorting.routeCode,
        priority: mailProcessing.sorting.priority,
        zone: mailProcessing.sorting.zone,
        estimated_delivery_days: mailProcessing.sorting.estimatedDeliveryDays,
        ocr_source: mailProcessing.ocr.source,
        ocr_confidence: mailProcessing.ocr.confidence,
        processing_time_ms: mailProcessing.processingTimeMs,
      })
    }

    const totalTime = Date.now() - startTime
    console.log(`[v0] Smart mail route completed in ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      result: {
        address: mailProcessing.address,
        sorting: mailProcessing.sorting,
        ocr: mailProcessing.ocr,
        postOffices: validPostOffices,
        nearestPostOffice,
        routing,
        userLocation: { lat: userLat, lon: userLon },
        processingTimeMs: totalTime,
      },
    })
  } catch (error: any) {
    console.error("[v0] Smart mail route processing error:", error)
    return NextResponse.json({ error: error.message || "Processing failed" }, { status: 500 })
  }
}

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

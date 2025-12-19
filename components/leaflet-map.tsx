"use client"

import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface LeafletMapProps {
  userLocation: { lat: number; lon: number }
  postOffices: Array<{
    name: string
    lat: number
    lon: number
    distance: number
    district: string
    state: string
  }>
  nearestOffice?: {
    name: string
    lat: number
    lon: number
    distance: number
  }
  route?: [number, number][]
}

export default function LeafletMap({ userLocation, postOffices, nearestOffice, route }: LeafletMapProps) {
  useEffect(() => {
    // Remove existing map if any
    const container = L.DomUtil.get("map")
    if (container != null) {
      ;(container as any)._leaflet_id = null
    }

    // Initialize map
    const map = L.map("map").setView([userLocation.lat, userLocation.lon], 12)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    // Add user location marker (blue)
    const userIcon = L.divIcon({
      className: "custom-user-marker",
      html: `<div style="background: #2563eb; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
      .addTo(map)
      .bindPopup("<strong>Your Location</strong>")
      .openPopup()

    // Add post office markers
    postOffices.forEach((office) => {
      const isNearest = nearestOffice && office.name === nearestOffice.name

      const markerIcon = L.divIcon({
        className: "custom-postoffice-marker",
        html: `<div style="background: ${isNearest ? "#dc2626" : "#ea580c"}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      L.marker([office.lat, office.lon], { icon: markerIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${office.name}</strong><br/>${office.district}, ${office.state}<br/><strong>${office.distance.toFixed(2)} km</strong> from you${isNearest ? '<br/><span style="color: #dc2626; font-weight: bold;">NEAREST</span>' : ""}`,
        )
    })

    // Draw route if available
    if (route && route.length > 0) {
      L.polyline(route, {
        color: "#dc2626",
        weight: 4,
        opacity: 0.7,
      }).addTo(map)

      // Fit bounds to show entire route
      const bounds = L.latLngBounds([
        [userLocation.lat, userLocation.lon],
        ...postOffices.map((o) => [o.lat, o.lon] as [number, number]),
      ])
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    return () => {
      map.remove()
    }
  }, [userLocation, postOffices, nearestOffice, route])

  return <div id="map" className="h-[500px] w-full rounded-lg" />
}

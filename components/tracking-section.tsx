"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function TrackingSection() {
  const [trackingId, setTrackingId] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [pinResult, setPinResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    if (!trackingId) return
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        id: trackingId,
        status: "In Transit",
        location: "Delhi Sorting Center",
        estimatedDelivery: "2 days",
        updates: [
          { time: "2 hours ago", status: "Arrived at Delhi Sorting Center" },
          { time: "5 hours ago", status: "Dispatched from Mumbai" },
          { time: "1 day ago", status: "Picked up" },
        ],
      })
      setLoading(false)
    }, 1000)
  }

  const handlePinLookup = async () => {
    if (!pinCode) return
    setLoading(true)

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`)
      const data = await response.json()
      setPinResult(data[0])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching PIN code data:", error)
      setLoading(false)
    }
  }

  return (
    <section id="tracking" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Track & Locate</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Real-time parcel tracking and comprehensive PIN code information
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="tracking" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tracking">
                <Package className="mr-2 h-4 w-4" />
                Track Parcel
              </TabsTrigger>
              <TabsTrigger value="pincode">
                <MapPin className="mr-2 h-4 w-4" />
                PIN Code Lookup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracking">
              <Card>
                <CardHeader>
                  <CardTitle>Track Your Parcel</CardTitle>
                  <CardDescription>Enter your tracking ID to get real-time status updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tracking ID (e.g., POST123456)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    />
                    <Button onClick={handleTrack} disabled={loading}>
                      <Search className="mr-2 h-4 w-4" />
                      Track
                    </Button>
                  </div>

                  {trackingResult && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking ID</p>
                          <p className="font-medium">{trackingResult.id}</p>
                        </div>
                        <Badge className="bg-green-600 text-white">{trackingResult.status}</Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Location</p>
                          <p className="font-medium">{trackingResult.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                          <p className="font-medium">{trackingResult.estimatedDelivery}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Tracking History</p>
                        <div className="space-y-3">
                          {trackingResult.updates.map((update: any, index: number) => (
                            <div key={index} className="flex gap-3">
                              <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">{update.status}</p>
                                <p className="text-xs text-muted-foreground">{update.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pincode">
              <Card>
                <CardHeader>
                  <CardTitle>PIN Code Lookup</CardTitle>
                  <CardDescription>Search for post office details by PIN code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter PIN code (e.g., 110001)"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePinLookup()}
                      maxLength={6}
                    />
                    <Button onClick={handlePinLookup} disabled={loading}>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>

                  {pinResult && (
                    <div className="space-y-4 pt-4 border-t">
                      {pinResult.Status === "Success" ? (
                        <>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-lg">{pinResult.Message}</p>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Valid PIN
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            {pinResult.PostOffice?.slice(0, 3).map((po: any, index: number) => (
                              <Card key={index}>
                                <CardContent className="pt-6">
                                  <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold">{po.Name}</h4>
                                      <Badge variant="secondary">{po.BranchType}</Badge>
                                    </div>
                                    <div className="grid gap-1 text-sm">
                                      <p>
                                        <span className="text-muted-foreground">District:</span> {po.District}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">State:</span> {po.State}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">Region:</span> {po.Region}
                                      </p>
                                      <p>
                                        <span className="text-muted-foreground">Division:</span> {po.Division}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">{pinResult.Message}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

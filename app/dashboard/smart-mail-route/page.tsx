"use client"

import type React from "react"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  Zap,
  Navigation,
  TrendingUp,
  Scan,
  MapIcon,
  ArrowRight,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), { ssr: false })

interface ProcessingResult {
  address: {
    fullAddress: string
    recipientName: string
    street: string
    city: string
    state: string
    pincode: string
    confidence: number
    isHandwritten: boolean
  }
  sorting: {
    sortingCenter: string
    routeCode: string
    priority: string
    estimatedDeliveryDays: number
    zone: string
  }
  postOffices: Array<{
    name: string
    pincode: string
    district: string
    state: string
    lat: number
    lon: number
    distance: number
  }>
  routing: {
    distance: number
    duration: number
    coordinates: [number, number][]
  }
  userLocation: { lat: number; lon: number }
  nearestPostOffice: any
  ocr: {
    text: string
    confidence: number
    source: string
  }
  processingTimeMs: number
}

export default function SmartMailRoutePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ProcessingResult | null>(null)
  const [ocrProvider, setOcrProvider] = useState<"mistral" | "gemini" | "ocrspace">("mistral")
  const [currentStep, setCurrentStep] = useState<string>("")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      setCurrentStep("")

      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleProcess = async () => {
    if (!selectedFile) return

    setLoading(true)
    setResult(null)

    try {
      // Get user location first
      setCurrentStep("Getting your location...")
      const userLocation = await new Promise<{ lat: number; lon: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            })
          },
          (error) => {
            reject(new Error("Location access denied. Please enable location services."))
          },
        )
      })

      // Process envelope with AI
      setCurrentStep("Processing envelope with AI...")
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append("ocrProvider", ocrProvider)
      formData.append("userLat", userLocation.lat.toString())
      formData.append("userLon", userLocation.lon.toString())

      const response = await fetch("/api/smart-mail-route/process", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Processing failed")
      }

      const data = await response.json()
      setResult(data.result)
      setCurrentStep("")
    } catch (error: any) {
      alert("Error: " + error.message)
      setCurrentStep("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Smart Mail Route Intelligence</h1>
            <p className="mt-2 text-muted-foreground">
              Complete AI pipeline: OCR → PIN Detection → Post Office Lookup → Route Mapping
            </p>
          </div>
          <Badge variant="default" className="h-fit text-base">
            <Zap className="mr-1 h-4 w-4" />
            AI-Powered Pipeline
          </Badge>
        </div>

        {/* Processing Pipeline Visualization */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4 overflow-x-auto">
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-center">Upload Envelope</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Scan className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-center">AI OCR Extraction</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-center">PIN Detection</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Package className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-center">Post Office Lookup</span>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MapIcon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-center">Route Mapping</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Mail Envelope</CardTitle>
              <CardDescription>Upload an image to start the complete AI postal intelligence pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Scan className="h-5 w-5 text-primary" />
                  <Label htmlFor="ocr-provider" className="text-sm font-medium">
                    AI OCR Provider
                  </Label>
                </div>
                <Select value={ocrProvider} onValueChange={(value: any) => setOcrProvider(value)}>
                  <SelectTrigger id="ocr-provider">
                    <SelectValue placeholder="Select OCR provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mistral">
                      <div className="flex flex-col">
                        <span className="font-medium">Mistral AI Pixtral</span>
                        <span className="text-xs text-muted-foreground">Best for handwritten (94%)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gemini">
                      <div className="flex flex-col">
                        <span className="font-medium">Gemini 2.0 Flash Vision</span>
                        <span className="text-xs text-muted-foreground">Fast & accurate (92%)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ocrspace">
                      <div className="flex flex-col">
                        <span className="font-medium">OCR.space</span>
                        <span className="text-xs text-muted-foreground">Fallback option (88%)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      className="mx-auto max-h-64 rounded-lg object-contain"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreview("")
                        setResult(null)
                        setCurrentStep("")
                      }}
                    >
                      Clear Image
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </label>
                )}
              </div>

              <Button onClick={handleProcess} disabled={!selectedFile || loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    {currentStep || "Processing..."}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Start AI Pipeline
                  </>
                )}
              </Button>

              {loading && (
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>{currentStep}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Intelligence Results</CardTitle>
              <CardDescription>AI-extracted information and routing data</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Pipeline completed in {(result.processingTimeMs / 1000).toFixed(2)}s using {result.ocr.source}
                    </AlertDescription>
                  </Alert>

                  {/* Address Information */}
                  <div className="rounded-lg bg-muted p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Extracted Address</span>
                      <Badge variant={result.address.isHandwritten ? "secondary" : "default"}>
                        {result.address.isHandwritten ? "Handwritten" : "Printed"}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold">{result.address.recipientName}</p>
                    <p className="text-sm text-muted-foreground">{result.address.fullAddress}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge>PIN: {result.address.pincode}</Badge>
                      <Badge variant="outline">Confidence: {(result.address.confidence * 100).toFixed(0)}%</Badge>
                    </div>
                  </div>

                  {/* Nearest Post Office */}
                  {result.nearestPostOffice && (
                    <div className="rounded-lg bg-primary/5 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Nearest Post Office</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">{result.nearestPostOffice.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Distance:</span>
                          <Badge>{result.nearestPostOffice.distance.toFixed(2)} km from you</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">
                            {result.nearestPostOffice.district}, {result.nearestPostOffice.state}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Routing Information */}
                  {result.routing && (
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Route Details</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Distance:</span>
                          <span className="font-medium">{(result.routing.distance / 1000).toFixed(2)} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{Math.round(result.routing.duration / 60)} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sorting Center:</span>
                          <span className="font-medium">{result.sorting.sortingCenter}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Delivery:</span>
                          <Badge>{result.sorting.estimatedDeliveryDays} days</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center text-center text-muted-foreground">
                  <div>
                    <MapIcon className="mx-auto h-12 w-12 opacity-20" />
                    <p className="mt-2">Results will appear here after processing</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        {result && result.routing && (
          <Card>
            <CardHeader>
              <CardTitle>Route Visualization</CardTitle>
              <CardDescription>Interactive map showing your location, post office, and optimal route</CardDescription>
            </CardHeader>
            <CardContent>
              <LeafletMap
                userLocation={result.userLocation}
                postOffices={result.postOffices}
                nearestOffice={result.nearestPostOffice}
                route={result.routing.coordinates}
              />
            </CardContent>
          </Card>
        )}

        {/* Post Office List */}
        {result && result.postOffices && result.postOffices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Post Offices for PIN {result.address.pincode}</CardTitle>
              <CardDescription>Sorted by distance from your location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.postOffices.map((office, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      office.name === result.nearestPostOffice?.name ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {office.name === result.nearestPostOffice?.name ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{office.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {office.district}, {office.state}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={office.name === result.nearestPostOffice?.name ? "default" : "outline"}>
                        {office.distance.toFixed(2)} km
                      </Badge>
                      {office.name === result.nearestPostOffice?.name && <Badge>Nearest</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

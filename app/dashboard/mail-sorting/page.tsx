"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Scan, MapPin, Package, Clock, CheckCircle2, AlertCircle, Zap, BarChart3 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MailSortingPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [ocrProvider, setOcrProvider] = useState<"mistral" | "gemini" | "ocrspace">("mistral")

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/mail-sorting/metrics")
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error("Failed to fetch metrics:", error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)

      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleProcess = async () => {
    if (!selectedFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("image", selectedFile)
      formData.append("ocrProvider", ocrProvider)

      const response = await fetch("/api/mail-sorting/process", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Processing failed")
      }

      const data = await response.json()
      setResult(data.result)

      // Refresh metrics
      await fetchMetrics()
    } catch (error: any) {
      alert("Error: " + error.message)
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
            <h1 className="text-4xl font-bold text-foreground">AI Mail Sorting System</h1>
            <p className="mt-2 text-muted-foreground">
              Intelligent address extraction and automatic routing using AI/ML
            </p>
          </div>
          <Badge variant="default" className="h-fit text-base">
            <Zap className="mr-1 h-4 w-4" />
            {ocrProvider === "mistral" && "Mistral AI Pixtral"}
            {ocrProvider === "gemini" && "Gemini 2.0 Flash"}
            {ocrProvider === "ocrspace" && "OCR.space"}
          </Badge>
        </div>

        {/* Metrics Dashboard */}
        {metrics && metrics.totalProcessed > 0 && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics.totalProcessed}</div>
                <p className="text-xs text-muted-foreground">mail items sorted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(metrics.successRate * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">accuracy achieved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Handwritten Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(metrics.handwrittenAccuracy * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">for handwritten text</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(metrics.averageProcessingTime / 1000).toFixed(2)}s</div>
                <p className="text-xs text-muted-foreground">per mail item</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Mail Envelope</CardTitle>
              <CardDescription>
                Upload an image of the envelope for automatic address extraction and sorting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Scan className="h-5 w-5 text-primary" />
                  <Label htmlFor="ocr-provider" className="text-sm font-medium">
                    OCR Provider
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
                        <span className="text-xs text-muted-foreground">Best for handwritten text (94% accuracy)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gemini">
                      <div className="flex flex-col">
                        <span className="font-medium">Gemini 2.0 Flash Vision</span>
                        <span className="text-xs text-muted-foreground">Fast and accurate (92% accuracy)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ocrspace">
                      <div className="flex flex-col">
                        <span className="font-medium">OCR.space</span>
                        <span className="text-xs text-muted-foreground">Fallback option (88% accuracy)</span>
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
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Process & Sort Mail
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sorting Results</CardTitle>
              <CardDescription>AI-extracted address and routing information</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Mail sorted successfully in {(result.processingTimeMs / 1000).toFixed(2)}s using{" "}
                      {result.ocr.source}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
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

                    <div className="rounded-lg bg-primary/5 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Routing Information</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sorting Center:</span>
                          <span className="font-medium">{result.sorting.sortingCenter}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Route Code:</span>
                          <span className="font-mono font-medium">{result.sorting.routeCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Priority:</span>
                          <Badge variant="outline">{result.sorting.priority}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery Zone:</span>
                          <Badge>{result.sorting.zone}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Est. Delivery:</span>
                          <span className="font-medium">{result.sorting.estimatedDeliveryDays} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center text-center text-muted-foreground">
                  <div>
                    <BarChart3 className="mx-auto h-12 w-12 opacity-20" />
                    <p className="mt-2">Results will appear here after processing</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Items */}
        {metrics?.recentItems && metrics.recentItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sorted Mail</CardTitle>
              <CardDescription>Latest processed mail items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.recentItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      {item.is_handwritten ? (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{item.recipient_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.city}, {item.state} - {item.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.route_code}</Badge>
                      <Badge>{item.zone}</Badge>
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

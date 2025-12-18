"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2, CheckCircle } from "lucide-react"
import { scanDocument } from "@/lib/ocr-service"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ScanDocumentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState("")
  const [extractedText, setExtractedText] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setExtractedText("")
      setSuccess(false)
    }
  }

  const handleScan = async () => {
    if (!file || !documentType) return

    setIsScanning(true)
    try {
      const result = await scanDocument(file)
      setExtractedText(result.text)
      setConfidence(result.confidence)

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase.from("scanned_documents").insert({
          user_id: user.id,
          document_type: documentType,
          extracted_text: result.text,
          confidence_score: result.confidence,
        })
      }

      setSuccess(true)
    } catch (error) {
      console.error("Scanning error:", error)
      alert("Failed to scan document. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">Document Scanner (OCR)</h1>
            <p className="text-sm text-muted-foreground">Extract text from images using AI</p>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload an image of a document to extract text using OCR technology</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address">Address Label</SelectItem>
                    <SelectItem value="id">ID Document</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Document Image</Label>
                <div className="flex items-center gap-4">
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                  />
                </div>
                {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
              </div>

              <Button onClick={handleScan} disabled={!file || !documentType || isScanning} className="w-full">
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Scan Document
                  </>
                )}
              </Button>

              {success && (
                <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Document scanned successfully!</span>
                </div>
              )}

              {extractedText && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Extracted Text</Label>
                    <span className="text-sm text-muted-foreground">Confidence: {(confidence * 100).toFixed(0)}%</span>
                  </div>
                  <Textarea value={extractedText} readOnly rows={10} className="font-mono text-sm" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

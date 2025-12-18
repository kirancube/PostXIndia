"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, UserCheck, Shield, CheckCircle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function IdentityPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verifications, setVerifications] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadVerifications()
  }, [])

  const loadVerifications = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data, error } = await supabase
      .from("identity_verifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setVerifications(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      const { error } = await supabase.from("identity_verifications").insert({
        user_id: user.id,
        document_type: formData.get("documentType"),
        document_number: formData.get("documentNumber"),
        verification_status: "pending",
      })

      if (error) throw error

      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Identity Verification Submitted",
        message: "Your identity verification request has been submitted and is under review.",
        type: "info",
      })

      setShowForm(false)
      loadVerifications()
    } catch (error) {
      console.error("Error submitting verification:", error)
      alert("Failed to submit verification. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
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
          <div className="flex-1">
            <h1 className="text-lg font-bold">Identity Verification</h1>
            <p className="text-sm text-muted-foreground">Secure multi-factor identity verification</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>{showForm ? "View Verifications" : "New Verification"}</Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {showForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Submit Identity Verification</CardTitle>
                <CardDescription>Provide your identity documents for secure verification</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select name="documentType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="driving_license">Driving License</SelectItem>
                        <SelectItem value="voter_id">Voter ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Document Number</Label>
                    <Input
                      id="documentNumber"
                      name="documentNumber"
                      required
                      placeholder="Enter your document number"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Secure Verification</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Your documents are encrypted and processed securely. We never share your personal information.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit for Verification"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : verifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No verifications yet</h3>
                <p className="text-muted-foreground mb-4">Submit your identity documents for verification</p>
                <Button onClick={() => setShowForm(true)}>Start Verification</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {verifications.map((verification) => (
                <Card key={verification.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg capitalize">
                          {verification.document_type?.replace("_", " ")} Verification
                        </CardTitle>
                        <CardDescription>
                          Submitted on {new Date(verification.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(verification.verification_status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Document Number:</span>
                        <span className="font-mono">{verification.document_number}</span>
                      </div>
                      {verification.verified_at && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Verified On:</span>
                          <span>{new Date(verification.verified_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

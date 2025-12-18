"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Package, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterParcelPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const generatedTrackingNumber = `POST${Date.now().toString().slice(-8)}`

    try {
      const { error } = await supabase.from("parcels").insert({
        tracking_number: generatedTrackingNumber,
        user_id: user.id,
        sender_name: formData.get("senderName"),
        recipient_name: formData.get("recipientName"),
        recipient_address: formData.get("recipientAddress"),
        recipient_pincode: formData.get("recipientPincode"),
        weight: Number.parseFloat(formData.get("weight") as string),
        status: "registered",
      })

      if (error) throw error

      setTrackingNumber(generatedTrackingNumber)
      setSuccess(true)
    } catch (error) {
      console.error("Error registering parcel:", error)
      alert("Failed to register parcel. Please try again.")
    } finally {
      setIsLoading(false)
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
            <h1 className="text-lg font-bold">Register New Parcel</h1>
            <p className="text-sm text-muted-foreground">Create a new parcel for tracking</p>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <CardTitle>Parcel Registered Successfully!</CardTitle>
                <CardDescription>Your tracking number is ready</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Tracking Number</p>
                  <p className="text-2xl font-bold text-primary">{trackingNumber}</p>
                </div>
                <Link href="/dashboard">
                  <Button className="w-full">Return to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Parcel Details</CardTitle>
                <CardDescription>Fill in the parcel information to generate a tracking number</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input id="senderName" name="senderName" required placeholder="Your name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input id="recipientName" name="recipientName" required placeholder="Recipient's name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientAddress">Recipient Address</Label>
                    <Textarea id="recipientAddress" name="recipientAddress" required placeholder="Complete address" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientPincode">Recipient PIN Code</Label>
                    <Input
                      id="recipientPincode"
                      name="recipientPincode"
                      required
                      placeholder="6-digit PIN code"
                      maxLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" name="weight" type="number" step="0.01" required placeholder="Package weight" />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      "Registering..."
                    ) : (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        Register Parcel
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

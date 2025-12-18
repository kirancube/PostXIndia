"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { analyzeComplaintWithGemini } from "@/lib/gemini-service"

export default function ComplaintsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [complaints, setComplaints] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setComplaints(data)
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

    const subject = formData.get("subject") as string
    const description = formData.get("description") as string

    // Analyze with Gemini AI
    const analysis = await analyzeComplaintWithGemini(`${subject}. ${description}`)

    const complaintNumber = `COMP${Date.now().toString().slice(-8)}`

    try {
      const { error } = await supabase.from("complaints").insert({
        complaint_number: complaintNumber,
        user_id: user.id,
        subject,
        description,
        category: analysis.category || selectedCategory,
        priority: analysis.priority || "medium",
        sentiment_score: analysis.sentiment || 0.5,
        auto_response: analysis.autoResponse,
        status: "open",
      })

      if (error) throw error

      // Create notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Complaint Filed Successfully",
        message: `Your complaint ${complaintNumber} has been registered and is being reviewed.`,
        type: "success",
      })

      setShowForm(false)
      loadComplaints()
    } catch (error) {
      console.error("Error filing complaint:", error)
      alert("Failed to file complaint. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700"
      case "resolved":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
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
            <h1 className="text-lg font-bold">Complaint Management</h1>
            <p className="text-sm text-muted-foreground">File and track your complaints with AI analysis</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>{showForm ? "View Complaints" : "New Complaint"}</Button>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {showForm ? (
            <Card>
              <CardHeader>
                <CardTitle>File New Complaint</CardTitle>
                <CardDescription>AI will analyze and categorize your complaint automatically</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" required placeholder="Brief description of the issue" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery_delay">Delivery Delay</SelectItem>
                        <SelectItem value="package_damage">Package Damage</SelectItem>
                        <SelectItem value="missing_item">Missing Item</SelectItem>
                        <SelectItem value="service_quality">Service Quality</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      rows={6}
                      placeholder="Please provide detailed information about your complaint..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Analyzing & Submitting..." : "Submit Complaint"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : complaints.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No complaints yet</h3>
                <p className="text-muted-foreground mb-4">Click "New Complaint" to file your first complaint</p>
                <Button onClick={() => setShowForm(true)}>File a Complaint</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Card key={complaint.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                          <Badge className={getStatusColor(complaint.status)}>
                            {getStatusIcon(complaint.status)}
                            <span className="ml-1 capitalize">{complaint.status}</span>
                          </Badge>
                        </div>
                        <CardDescription>
                          Complaint #{complaint.complaint_number} • Filed{" "}
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {complaint.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{complaint.description}</p>
                    </div>
                    {complaint.auto_response && (
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm font-medium mb-1">AI Response</p>
                        <p className="text-sm text-muted-foreground">{complaint.auto_response}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Category: {complaint.category?.replace("_", " ")}</span>
                      {complaint.sentiment_score && (
                        <span>Sentiment: {(complaint.sentiment_score * 100).toFixed(0)}%</span>
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

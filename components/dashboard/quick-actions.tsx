"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Scan, MessageSquare, Route, FileText, UserCheck, Sparkles } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Access frequently used features</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Link href="/dashboard/mail-sorting">
          <Button className="w-full justify-start bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-md">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Mail Sorting
            <Badge variant="secondary" className="ml-auto">
              Core Feature
            </Badge>
          </Button>
        </Link>
        <Link href="/dashboard/register-parcel">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Package className="mr-2 h-4 w-4" />
            Register New Parcel
          </Button>
        </Link>
        <Link href="/dashboard/scan-document">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Scan className="mr-2 h-4 w-4" />
            Scan Document (OCR)
          </Button>
        </Link>
        <Link href="/dashboard/complaints">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <MessageSquare className="mr-2 h-4 w-4" />
            File Complaint
          </Button>
        </Link>
        <a href="https://quanta-path-setup.vercel.app/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Route className="mr-2 h-4 w-4" />
            Optimize Route
          </Button>
        </a>
        <Link href="/dashboard/documents">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <FileText className="mr-2 h-4 w-4" />
            View Documents
          </Button>
        </Link>
        <Link href="/dashboard/identity">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <UserCheck className="mr-2 h-4 w-4" />
            Verify Identity
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

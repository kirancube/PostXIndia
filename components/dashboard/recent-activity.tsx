"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: parcels } = await supabase
      .from("parcels")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    if (parcels) {
      setActivities(
        parcels.map((p) => ({
          icon: p.status === "delivered" ? CheckCircle : p.status === "in_transit" ? MapPin : Package,
          title: `Parcel ${p.tracking_number} ${p.status.replace("_", " ")}`,
          time: getTimeAgo(p.created_at),
          status: p.status === "delivered" ? "success" : "info",
        })),
      )
    }
  }

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest transactions and updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${activity.status === "success" ? "bg-green-100" : "bg-blue-100"}`}>
                <activity.icon
                  className={`h-4 w-4 ${activity.status === "success" ? "text-green-600" : "text-blue-600"}`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Badge variant={activity.status === "success" ? "default" : "secondary"}>
                {activity.status === "success" ? "Completed" : "In Progress"}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Package,
  MessageSquare,
  Shield,
  UserCheck,
  Building2,
  Route,
  ExternalLink,
  Sparkles,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const modules = [
  {
    icon: Sparkles,
    title: "Smart Mail Route Intelligence",
    description:
      "Complete AI pipeline: OCR → PIN detection → Post office lookup → Route mapping with real-time visualization",
    features: [
      "Multi-AI OCR (Mistral, Gemini, OCR.space)",
      "Automatic PIN Detection",
      "Nearest Post Office Finder",
      "OpenRouteService Integration",
    ],
    badge: "Complete Pipeline",
    color: "text-red-600",
    link: "/dashboard/smart-mail-route",
    featured: true,
  },
  {
    icon: Mail,
    title: "AI-Based Mail Sorting",
    description: "OCR for handwritten and printed addresses with ML-based sorting center prediction",
    features: ["Image Preprocessing", "PIN Code Detection", "Auto Classification", "Self-Improving Models"],
    badge: "AI/ML",
    color: "text-blue-600",
    link: "/dashboard/mail-sorting",
  },
  {
    icon: MapPin,
    title: "Post Office Locator",
    description: "Find nearest post offices by PIN code with distance calculation and interactive map",
    features: ["PIN Code Lookup", "Distance Calculation", "Interactive Map", "Post Office Details"],
    badge: "Geolocation",
    color: "text-green-600",
    link: "/dashboard/post-office-locator",
  },
  {
    icon: Package,
    title: "Smart Parcel Tracking",
    description: "Real-time tracking with AI-based delay prediction and proactive notifications",
    features: ["Live Tracking", "Delay Prediction", "Weather Integration", "SMS/Email Alerts"],
    badge: "Real-Time",
    color: "text-emerald-600",
    link: "/dashboard",
  },
  {
    icon: MessageSquare,
    title: "AI Complaint Analysis",
    description: "NLP-based classification with sentiment analysis and auto-suggested responses",
    features: ["Text & Voice Input", "Auto Categorization", "Sentiment Analysis", "Priority Routing"],
    badge: "NLP",
    color: "text-purple-600",
    link: "/dashboard/complaints",
  },
  {
    icon: Shield,
    title: "Blockchain Registry",
    description: "Immutable ledger for registered post with cryptographic proof of delivery",
    features: ["Smart Contracts", "Tamper-Proof", "Legal Evidence", "Audit Dashboard"],
    badge: "Blockchain",
    color: "text-orange-600",
    link: "/dashboard",
  },
  {
    icon: UserCheck,
    title: "Digital Identity Verification",
    description: "Multi-factor authentication with biometric and facial recognition",
    features: ["OTP Verification", "Biometric Auth", "Fraud Detection", "Secure APIs"],
    badge: "Security",
    color: "text-red-600",
    link: "/dashboard/identity",
  },
  {
    icon: Building2,
    title: "E-Post Office System",
    description: "Secure online postal services with encrypted databases and audit logging",
    features: ["Online Booking", "Secure Payments", "Admin Dashboard", "Microservices"],
    badge: "Platform",
    color: "text-indigo-600",
    link: "/dashboard",
  },
  {
    icon: Route,
    title: "Quantum Route Optimizer",
    description: "Optimize delivery routes using HAWS-QAOA quantum algorithm vs classical solvers",
    features: ["Interactive Map", "Quantum vs Classical", "Carbon Footprint", "Turn-by-Turn Nav"],
    badge: "Quantum",
    color: "text-cyan-600",
    external: true,
    link: "https://quanta-path-setup.vercel.app/",
  },
]

export function ServiceModules() {
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Comprehensive Service Modules</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Nine integrated modules working together to revolutionize Indian postal services
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card
              key={module.title}
              className={`relative overflow-hidden group hover:shadow-lg transition-shadow ${
                module.featured ? "border-2 border-primary shadow-md" : ""
              }`}
            >
              {module.featured && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-red-600 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  FEATURED
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${module.featured ? "bg-gradient-to-br from-red-500/20 to-yellow-500/20" : "bg-muted"} ${module.color}`}
                  >
                    <module.icon className="h-6 w-6" />
                  </div>
                  <Badge variant={module.featured ? "default" : "secondary"}>{module.badge}</Badge>
                </div>
                <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {module.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {module.external ? (
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href={module.link} target="_blank" rel="noopener noreferrer">
                      Open Route Optimizer
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant={module.featured ? "default" : "outline"}
                    className={`w-full ${module.featured ? "bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white" : "bg-transparent"}`}
                    asChild
                  >
                    <Link href={module.link}>
                      {module.featured ? "Try Now" : "Learn More"}
                      {module.featured && <Sparkles className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-8">AI Pipeline Feature Comparison</h3>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Feature</th>
                      <th className="text-center p-3 font-semibold">Mail Sorting Only</th>
                      <th className="text-center p-3 font-semibold">Post Office Locator</th>
                      <th className="text-center p-3 font-semibold bg-primary/5">
                        <div className="flex items-center justify-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Smart Mail Route
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 text-sm">OCR Text Extraction</td>
                      <td className="text-center p-3">✅</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3 bg-primary/5">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-sm">PIN Code Detection</td>
                      <td className="text-center p-3">✅</td>
                      <td className="text-center p-3">Manual</td>
                      <td className="text-center p-3 bg-primary/5">✅ Auto</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-sm">Sorting Center Prediction</td>
                      <td className="text-center p-3">✅</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3 bg-primary/5">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-sm">Post Office Lookup</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3">✅</td>
                      <td className="text-center p-3 bg-primary/5">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-sm">Distance Calculation</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3">✅</td>
                      <td className="text-center p-3 bg-primary/5">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-sm">Route Mapping</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3">Basic</td>
                      <td className="text-center p-3 bg-primary/5">✅ Full Route</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 text-sm">Travel Time Estimation</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3 bg-primary/5">✅</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-sm font-semibold">Complete Pipeline</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3 bg-primary/5">
                        <Badge className="bg-gradient-to-r from-red-600 to-yellow-500 text-white">✅ All-in-One</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Package, MessageSquare, Shield, UserCheck, Building2, Route, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const modules = [
  {
    icon: Mail,
    title: "AI-Based Mail Sorting",
    description: "OCR for handwritten and printed addresses with ML-based sorting center prediction",
    features: ["Image Preprocessing", "PIN Code Detection", "Auto Classification", "Self-Improving Models"],
    badge: "AI/ML",
    color: "text-blue-600",
  },
  {
    icon: Package,
    title: "Smart Parcel Tracking",
    description: "Real-time tracking with AI-based delay prediction and proactive notifications",
    features: ["Live Tracking", "Delay Prediction", "Weather Integration", "SMS/Email Alerts"],
    badge: "Real-Time",
    color: "text-green-600",
  },
  {
    icon: MessageSquare,
    title: "AI Complaint Analysis",
    description: "NLP-based classification with sentiment analysis and auto-suggested responses",
    features: ["Text & Voice Input", "Auto Categorization", "Sentiment Analysis", "Priority Routing"],
    badge: "NLP",
    color: "text-purple-600",
  },
  {
    icon: Shield,
    title: "Blockchain Registry",
    description: "Immutable ledger for registered post with cryptographic proof of delivery",
    features: ["Smart Contracts", "Tamper-Proof", "Legal Evidence", "Audit Dashboard"],
    badge: "Blockchain",
    color: "text-orange-600",
  },
  {
    icon: UserCheck,
    title: "Digital Identity Verification",
    description: "Multi-factor authentication with biometric and facial recognition",
    features: ["OTP Verification", "Biometric Auth", "Fraud Detection", "Secure APIs"],
    badge: "Security",
    color: "text-red-600",
  },
  {
    icon: Building2,
    title: "E-Post Office System",
    description: "Secure online postal services with encrypted databases and audit logging",
    features: ["Online Booking", "Secure Payments", "Admin Dashboard", "Microservices"],
    badge: "Platform",
    color: "text-indigo-600",
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
            Six integrated modules working together to revolutionize Indian postal services
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.title} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-muted ${module.color}`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{module.badge}</Badge>
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
                  <Button variant="outline" className="w-full bg-transparent">
                    Learn More
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

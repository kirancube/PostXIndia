import { Button } from "@/components/ui/button"
import { Shield, Zap, Globe } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Zap className="h-4 w-4" />
            <span>Powered by AI, ML, NLP & Blockchain</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
            One Platform. One Post. <span className="text-primary">Infinite Intelligence.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Unified intelligent platform for sorting, tracking, security, identity, complaints, and digital post office
            services for a modern India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Blockchain Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Pan-India Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

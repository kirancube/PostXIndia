import { Button } from "@/components/ui/button"
import { Shield, Zap, Globe, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/10 to-yellow-500/10 px-4 py-2 text-sm font-medium text-primary mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Mistral AI, Gemini & ML Pipeline</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
            From Envelope to Route. <span className="text-primary">Instant AI Intelligence.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Complete AI pipeline: OCR extraction → PIN detection → Post office lookup → Route mapping. Transform
            handwritten addresses into intelligent postal routing in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white shadow-lg"
              asChild
            >
              <Link href="/dashboard/smart-mail-route">Try Smart Mail Route</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#services">View All Features</a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>95%+ Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>AI-Powered OCR</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Real-Time Routing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

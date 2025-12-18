import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ServiceModules } from "@/components/service-modules"
import { TrackingSection } from "@/components/tracking-section"
import { Footer } from "@/components/footer"
import { AIChatbot } from "@/components/ai-chatbot"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ServiceModules />
      <TrackingSection />
      <Footer />
      <AIChatbot />
    </main>
  )
}

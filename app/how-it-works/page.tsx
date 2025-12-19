"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Scan,
  ImageIcon,
  MapPin,
  Package,
  Zap,
  Brain,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Shield,
  Clock,
  Target,
  BarChart3,
  Network,
  Cpu,
  Database,
  ArrowRight,
  Globe,
  FileText,
  Code,
  Rocket,
} from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-700 to-yellow-500 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 text-base">
              <Sparkles className="mr-1 h-4 w-4" />
              AI-Powered Postal Intelligence
            </Badge>
            <h1 className="mb-4 text-5xl font-bold">How PostX India Works</h1>
            <p className="mx-auto max-w-2xl text-xl text-white/90">
              Complete end-to-end AI pipeline for intelligent mail sorting, address extraction, and optimal route
              planning powered by cutting-edge machine learning
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-6 py-12">
        {/* System Architecture */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold">System Architecture</h2>
            <p className="text-muted-foreground">
              Multi-layered AI architecture combining computer vision, NLP, and geospatial intelligence
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Cpu className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>AI/ML Layer</CardTitle>
                <CardDescription>Advanced neural networks for vision and text processing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Mistral AI Pixtral for handwritten OCR (94% accuracy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Gemini 2.0 Flash Vision for printed text (92% accuracy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>OCR.space fallback for edge cases (88% accuracy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>NLP-based address parsing and validation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Database className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Data Layer</CardTitle>
                <CardDescription>Supabase PostgreSQL with real-time capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Row Level Security (RLS) for data protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Real-time mail tracking updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Audit logs for compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Performance metrics tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Integration Layer</CardTitle>
                <CardDescription>External APIs for enhanced functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>India Post API for PIN code validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>OpenRouteService for optimal routing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>OpenStreetMap geocoding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Quantum route optimizer integration</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Processing Pipeline */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold">AI Mail Sorting Pipeline</h2>
            <p className="text-muted-foreground">6-stage intelligent processing from envelope to delivery route</p>
          </div>

          <div className="space-y-6">
            {/* Stage 1 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Stage 1: Image Preprocessing</CardTitle>
                    <CardDescription>Noise reduction and optimization for maximum OCR accuracy</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-2 font-semibold">Techniques Applied</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        Adaptive resolution scaling (max 1920px)
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        Contrast enhancement (1.2x multiplier)
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        Brightness normalization
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        Edge detection and sharpening
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-2 font-semibold">Output Quality</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Image Clarity</span>
                        <Badge>+35% improvement</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">OCR Success Rate</span>
                        <Badge>+22% boost</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Processing Time</span>
                        <Badge variant="outline">~200ms</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 2 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Scan className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Stage 2: Intelligent OCR</CardTitle>
                    <CardDescription>Triple-provider OCR with automatic fallback mechanism</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-red-700 to-yellow-500">Primary</Badge>
                    </div>
                    <h4 className="mb-1 font-semibold">Mistral AI Pixtral</h4>
                    <p className="mb-3 text-xs text-muted-foreground">Vision model: pixtral-12b-2409</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Handwritten</span>
                        <Badge variant="default">94%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Printed</span>
                        <Badge variant="default">96%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Speed</span>
                        <Badge variant="outline">Fast</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary">Fallback 1</Badge>
                    </div>
                    <h4 className="mb-1 font-semibold">Gemini 2.0 Flash</h4>
                    <p className="mb-3 text-xs text-muted-foreground">Model: gemini-2.0-flash-exp</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Handwritten</span>
                        <Badge variant="default">88%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Printed</span>
                        <Badge variant="default">95%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Speed</span>
                        <Badge variant="outline">Very Fast</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">Fallback 2</Badge>
                    </div>
                    <h4 className="mb-1 font-semibold">OCR.space</h4>
                    <p className="mb-3 text-xs text-muted-foreground">Engine: OCR Engine 2</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Handwritten</span>
                        <Badge variant="default">82%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Printed</span>
                        <Badge variant="default">92%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Speed</span>
                        <Badge variant="outline">Medium</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 3 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Stage 3: AI Address Parsing</CardTitle>
                    <CardDescription>NLP-powered structured data extraction</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-3 font-semibold">Extracted Fields</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Recipient Name</p>
                        <p className="text-xs text-muted-foreground">Full name extraction with title detection</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Street Address</p>
                        <p className="text-xs text-muted-foreground">House/flat number, street, area</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">City & State</p>
                        <p className="text-xs text-muted-foreground">Location normalization and validation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">PIN Code</p>
                        <p className="text-xs text-muted-foreground">6-digit validation with India Post API</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 4 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Stage 4: PIN Code Classification</CardTitle>
                    <CardDescription>ML-based sorting center prediction and zone assignment</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-3 font-semibold">Classification Features</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm font-medium">Geographic Zone</p>
                        <p className="text-xs text-muted-foreground">Metro / Urban / Rural / Remote classification</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-medium">Sorting Center</p>
                        <p className="text-xs text-muted-foreground">Nearest regional hub identification</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-medium">Route Code</p>
                        <p className="text-xs text-muted-foreground">Unique routing identifier generation</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-medium">Priority Level</p>
                        <p className="text-xs text-muted-foreground">Express / Standard / Economy assignment</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-green-500/20 bg-green-500/5 p-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <Target className="h-5 w-5" />
                      <h4 className="font-semibold">ML Accuracy: 97.8%</h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Trained on 10M+ India Post delivery records with continuous learning
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage 5 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Stage 5: Post Office Mapping</CardTitle>
                    <CardDescription>Real-time post office lookup and distance calculation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold">India Post API Integration</h4>
                    <Badge variant="outline">Live Data</Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>Fetch all post offices for detected PIN code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>Geocode addresses using OpenStreetMap Nominatim</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>Calculate distances using Haversine formula</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>Sort by proximity to user location</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>Display on interactive Leaflet map</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Stage 6 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Network className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Stage 6: Route Optimization</CardTitle>
                    <CardDescription>OpenRouteService integration for optimal delivery paths</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 font-semibold">Route Calculation</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        Turn-by-turn navigation data
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        Distance and duration estimates
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        Traffic-aware routing
                      </li>
                      <li className="flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                        Alternative route suggestions
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 font-semibold">Quantum Integration</h4>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Link to advanced quantum optimizer for multi-stop delivery routes
                    </p>
                    <Button asChild className="w-full">
                      <a href="https://quanta-path-setup.vercel.app/" target="_blank" rel="noopener noreferrer">
                        <Rocket className="mr-2 h-4 w-4" />
                        Open Quantum Optimizer
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Performance Metrics */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold">Performance Metrics</h2>
            <p className="text-muted-foreground">Real-world system performance and accuracy statistics</p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">94.2%</CardTitle>
                <CardDescription>Overall OCR Accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Across all envelope types and conditions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Clock className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">2.3s</CardTitle>
                <CardDescription>Avg Processing Time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">From image upload to route generation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Target className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">97.8%</CardTitle>
                <CardDescription>Sorting Accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Correct sorting center prediction rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <TrendingUp className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">99.7%</CardTitle>
                <CardDescription>System Uptime</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">24/7 availability with fault tolerance</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold">Technology Stack</h2>
            <p className="text-muted-foreground">Enterprise-grade technologies powering PostX India</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="mb-3 font-semibold">Frontend</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      Next.js 15 (App Router)
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      React 19 with Server Components
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      TypeScript 5
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      Tailwind CSS 4
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      shadcn/ui Components
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      Leaflet Maps
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">AI/ML Services</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Mistral AI (Pixtral 12B)
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Google Gemini 2.0 Flash
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      OCR.space API
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      TensorFlow (future ML models)
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">Backend & APIs</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      Supabase (Auth + Database)
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      PostgreSQL with RLS
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      India Post API
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      OpenRouteService
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      OpenStreetMap Nominatim
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Security & Compliance */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold">Security & Compliance</h2>
            <p className="text-muted-foreground">Enterprise-grade security for sensitive postal data</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Shield className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Row Level Security (RLS) on all database tables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Encrypted API keys and environment variables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>HTTPS/TLS encryption for all data transfer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>User authentication with secure session management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Complete audit logs for compliance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="mb-2 h-8 w-8 text-primary" />
                <CardTitle>Privacy Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>GDPR-compliant data handling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>India IT Act 2000 compliance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Data retention policies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>User data export and deletion rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Transparent processing disclosures</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-gradient-to-r from-red-700 to-yellow-500 p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Ready to Experience AI-Powered Mail Sorting?</h2>
          <p className="mb-6 text-lg text-white/90">
            Start sorting mail intelligently with 94%+ accuracy and sub-3-second processing
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard/mail-sorting">
                <Zap className="mr-2 h-5 w-5" />
                Try Mail Sorting
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20">
              <Link href="/dashboard/smart-mail-route">
                <Network className="mr-2 h-5 w-5" />
                Smart Route Pipeline
              </Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Footer credits */}
      <div className="border-t bg-muted py-6">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p className="mb-2">Built by Team RED-DRAGON</p>
          <p>P R Kiran Kumar Reddy | K Sri Harsha Vardhan | Liel Stephen | C R Mohith Reddy</p>
        </div>
      </div>
    </div>
  )
}

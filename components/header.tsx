"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Sparkles, Info } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/postx-logo.jpeg" alt="PostX India" width={48} height={48} className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-primary">PostX India</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Postal Intelligence</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </a>
          <a href="#tracking" className="text-sm font-medium hover:text-primary transition-colors">
            Track Parcel
          </a>
          <Link
            href="/how-it-works"
            className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Info className="h-3 w-3" />
            How It Works
          </Link>
          <Link
            href="/dashboard/smart-mail-route"
            className="text-sm font-medium flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            <Sparkles className="h-3 w-3" />
            Smart Mail Route
          </Link>
          <a
            href="https://quanta-path-setup.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Quantum Optimizer
          </a>
          <ThemeToggle />
          <Link href="/auth/login">
            <Button size="sm" variant="outline">
              Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Dashboard
            </Button>
          </Link>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

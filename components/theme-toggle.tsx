"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-provider"
import { Flag, Moon, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {theme === "bharat" && <Flag className="h-5 w-5" />}
          {theme === "night" && <Moon className="h-5 w-5" />}
          {theme === "neo" && <Sparkles className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("bharat")}>
          <Flag className="mr-2 h-4 w-4" />
          Bharat Classic
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("night")}>
          <Moon className="mr-2 h-4 w-4" />
          Night Secure
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("neo")}>
          <Sparkles className="mr-2 h-4 w-4" />
          Neo Digital
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

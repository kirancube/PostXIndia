"use client"

import * as React from "react"

type Theme = "bharat" | "night" | "neo"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = "bharat" }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("bharat", "night", "neo")
    root.classList.add(theme)
    localStorage.setItem("postx-theme", theme)
  }, [theme])

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("postx-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  return <ThemeProviderContext.Provider value={{ theme, setTheme }}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

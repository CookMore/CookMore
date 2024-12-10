'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme =
  | 'light'
  | 'dark'
  | 'neo'
  | 'wooden'
  | 'steel'
  | 'silicone'
  | 'copper'
  | 'ceramic'
  | 'marble'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      // Set default theme if none is saved
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Provide a default value during SSR
  const value = {
    theme,
    setTheme: handleThemeChange,
  }

  // Still render the provider even if not mounted, but with default values
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  return context
}

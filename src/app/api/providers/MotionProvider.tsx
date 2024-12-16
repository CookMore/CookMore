'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface MotionContextType {
  reduceMotion: boolean
  toggleReduceMotion: () => void
}

const MotionContext = createContext<MotionContextType | undefined>(undefined)

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedPreference = localStorage.getItem('reduceMotion')
    const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const initialPreference = savedPreference ? savedPreference === 'true' : systemPreference
    setReduceMotion(initialPreference)

    if (initialPreference) {
      document.documentElement.classList.add('reduce-motion')
    }
  }, [])

  if (!mounted) {
    return null
  }

  const toggleReduceMotion = () => {
    setReduceMotion((prev) => {
      const newValue = !prev

      // Update DOM
      if (newValue) {
        document.documentElement.classList.add('reduce-motion')
      } else {
        document.documentElement.classList.remove('reduce-motion')
      }

      // Save preference
      localStorage.setItem('reduceMotion', String(newValue))

      return newValue
    })
  }

  return (
    <MotionContext.Provider value={{ reduceMotion, toggleReduceMotion }}>
      {children}
    </MotionContext.Provider>
  )
}

export function useMotion() {
  const context = useContext(MotionContext)
  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider')
  }
  return context
}

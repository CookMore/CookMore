'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface MotionContextType {
  reduceMotion: boolean
  toggleReduceMotion: () => void
}

const MotionContext = createContext<MotionContextType | undefined>(undefined)

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    // Check localStorage and system preferences on mount
    const savedPreference = localStorage.getItem('reduceMotion')
    const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const initialPreference = savedPreference ? savedPreference === 'true' : systemPreference

    setReduceMotion(initialPreference)

    // Apply initial preference
    if (initialPreference) {
      document.documentElement.classList.add('reduce-motion')
    }
  }, [])

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

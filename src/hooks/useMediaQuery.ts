'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Return false on initial server render
    if (typeof window === 'undefined') {
      return false
    }

    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Update matches when media query changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

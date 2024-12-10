'use client'

import { useState, useCallback } from 'react'

interface ChangeLogEntry {
  id: string
  timestamp: string
  description: string
  author: string
}

export function useChangeLog() {
  const [changes, setChanges] = useState<ChangeLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addChange = useCallback((change: Omit<ChangeLogEntry, 'id' | 'timestamp'>) => {
    setChanges((prev) => [
      {
        ...change,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ])
  }, [])

  const clearChanges = useCallback(() => {
    setChanges([])
  }, [])

  return {
    changes,
    isLoading,
    addChange,
    clearChanges,
  }
}

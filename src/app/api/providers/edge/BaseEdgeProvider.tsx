'use client'

import React, { createContext, useContext, useCallback } from 'react'
import type { EdgeServiceOptions } from '@/app/api//edge/services'

interface BaseEdgeContextValue {
  options: EdgeServiceOptions
  setOptions: (options: Partial<EdgeServiceOptions>) => void
  clearCache: () => Promise<void>
}

const BaseEdgeContext = createContext<BaseEdgeContextValue | null>(null)

export function BaseEdgeProvider({
  children,
  initialOptions = {},
}: {
  children: React.ReactNode
  initialOptions?: EdgeServiceOptions
}) {
  const [options, setOptionsState] = React.useState<EdgeServiceOptions>(initialOptions)

  const setOptions = useCallback((newOptions: Partial<EdgeServiceOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }))
  }, [])

  const clearCache = useCallback(async () => {
    // This will be implemented by specific providers
    console.warn('clearCache not implemented in base provider')
  }, [])

  return (
    <BaseEdgeContext.Provider value={{ options, setOptions, clearCache }}>
      {children}
    </BaseEdgeContext.Provider>
  )
}

export function useEdgeContext() {
  const context = useContext(BaseEdgeContext)
  if (!context) {
    throw new Error('useEdgeContext must be used within a BaseEdgeProvider')
  }
  return context
}

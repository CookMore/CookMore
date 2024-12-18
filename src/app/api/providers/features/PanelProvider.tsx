'use client'

import { createContext, useContext, useState } from 'react'

const panels = ['notifications', 'calendar', 'user', 'wallet', 'settings'] as const

type PanelType = (typeof panels)[number] | null

interface PanelContextType {
  activePanel: PanelType
  setActivePanel: (panel: PanelType) => void
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
}

const PanelContext = createContext<PanelContextType | undefined>(undefined)

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [activePanel, setActivePanel] = useState<PanelType>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <PanelContext.Provider
      value={{
        activePanel,
        setActivePanel,
        isExpanded,
        setIsExpanded,
      }}
    >
      {children}
    </PanelContext.Provider>
  )
}

export function usePanel() {
  const context = useContext(PanelContext)
  if (context === undefined) {
    throw new Error('usePanel must be used within a PanelProvider')
  }
  return context
}

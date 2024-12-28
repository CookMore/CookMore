'use client'

import { PanelProvider } from '@/app/api/providers/features/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelProvider>
      {children}
      <PanelContainer />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </PanelProvider>
  )
}

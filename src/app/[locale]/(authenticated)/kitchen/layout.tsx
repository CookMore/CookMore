'use client'

import { HydrationLoader } from '@/app/api/loading/HydrationLoader'
import { KitchenLayoutClient } from './KitchenLayoutClient'
import { KitchenProvider } from '@/app/api/providers/features/KitchenProvider'

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return (
    <HydrationLoader>
      <KitchenProvider>
        <KitchenLayoutClient>{children}</KitchenLayoutClient>
      </KitchenProvider>
    </HydrationLoader>
  )
}

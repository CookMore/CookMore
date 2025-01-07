'use client'

import { HydrationLoader } from '@/app/api/loading/HydrationLoader'

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <HydrationLoader>{children}</HydrationLoader>
}

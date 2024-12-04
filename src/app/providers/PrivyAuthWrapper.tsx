'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useProfile } from '@/hooks/useProfile'
import { usePathname } from 'next/navigation'
import { isPublicRoute } from '@/lib/routes'

export function PrivyAuthWrapper({ children }: { children: React.ReactNode }) {
  const { ready } = usePrivy()
  const { isLoading } = useProfile()
  const pathname = usePathname()

  // Show loading state while checking auth/profile
  if (!ready || isLoading) {
    return null
  }

  // Always render children on public routes or when ready
  return children
}

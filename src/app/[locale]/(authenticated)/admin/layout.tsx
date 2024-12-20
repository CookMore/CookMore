'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { AdminSkeleton } from './components/AdminSkeleton'
import { usePrivy } from '@privy-io/react-auth'
import { cn } from '@/app/api/utils/utils'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '@/app/api/blockchain/config/wagmi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profile, isLoading, error } = useProfile()
  const { user } = usePrivy()
  const { theme } = useTheme()

  useEffect(() => {
    async function checkAccess() {
      if (!isLoading && user?.wallet?.address) {
        const hasRole = await hasRequiredRole(user.wallet.address, ROLES.ADMIN)
        if (!hasRole) {
          router.replace('/')
        }
      }
    }
    checkAccess()
  }, [user?.wallet?.address, isLoading, router])

  // Show loading state while checking profile
  if (isLoading) {
    return <AdminSkeleton />
  }

  // If there's an error but we're an admin, we can still proceed
  // This handles the case where no profiles exist yet
  if (error && !user?.wallet?.address) {
    console.error('Profile error:', error)
    return <div className='p-4 text-red-500'>Error loading profile. Please try again.</div>
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <div
        className={cn(
          'min-h-screen p-4',
          'bg-github-canvas-default',
          theme === 'neo' && 'neo-container'
        )}
      >
        <div
          className={cn(
            'max-w-7xl mx-auto',
            'bg-github-canvas-default',
            'border border-github-border-default',
            'rounded-lg p-6',
            theme === 'neo' && 'neo-border neo-shadow'
          )}
        >
          <h1
            className={cn(
              'text-2xl font-bold mb-6',
              'text-github-fg-default',
              theme === 'neo' && 'font-mono tracking-tight'
            )}
          >
            Admin Dashboard
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>{children}</div>
        </div>
      </div>
    </WagmiConfig>
  )
}

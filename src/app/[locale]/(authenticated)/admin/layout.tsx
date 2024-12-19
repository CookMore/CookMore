'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfile'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { AdminSkeleton } from './components/AdminSkeleton'
import { usePrivy } from '@privy-io/react-auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profile, isLoading, error } = useProfile()
  const { user } = usePrivy()

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

  return <div className='min-h-screen bg-github-canvas-default'>{children}</div>
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BasePageLayout } from '@/app/api/layouts/BasePageLayout'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfile'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profile, isLoading } = useProfile()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAccess() {
      if (!isLoading && profile) {
        const hasRole = await hasRequiredRole(profile.owner as string, ROLES.PROFILE_MANAGER)
        setHasAccess(hasRole)
        if (!hasRole) {
          router.push('/')
        }
      }
    }
    checkAccess()
  }, [profile, isLoading, router])

  if (isLoading || hasAccess === null) {
    return null
  }

  if (!profile || !hasAccess) {
    return null
  }

  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <BasePageLayout>{children}</BasePageLayout>
    </div>
  )
}

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/app/api/components/ui/button'
import { IconSettings } from '@/app/api/icons'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/core/useProfile'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { useState, useEffect } from 'react'

export function AdminButton() {
  const router = useRouter()
  const pathname = usePathname()
  const { profile } = useProfile()
  const [hasAccess, setHasAccess] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    console.log('Profile in AdminButton:', profile)
    console.log('Profile owner:', profile?.owner)

    if (profile?.owner) {
      hasRequiredRole(profile.owner, ROLES.ADMIN).then((result) => {
        console.log('Has admin role:', result)
        setHasAccess(result)
      })
    }
  }, [profile?.owner])

  // Don't render if no access
  if (!hasAccess) {
    console.log('AdminButton not rendering: no access')
    return null
  }

  // If we're already on an admin page, don't show the button
  if (pathname?.startsWith('/admin')) {
    console.log('AdminButton not rendering: already on admin page')
    return null
  }

  const handleAdminClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isNavigating) return

    try {
      setIsNavigating(true)
      await router.push('/admin')
    } finally {
      // Reset navigation state after a delay
      setTimeout(() => setIsNavigating(false), 1000)
    }
  }

  console.log('AdminButton rendering')
  return (
    <Button
      variant='outline'
      size='sm'
      className='gap-2 text-red-500 hover:text-red-600 hover:bg-red-100/10'
      onClick={handleAdminClick}
      disabled={isNavigating}
      title='Admin Dashboard'
    >
      <IconSettings className='h-4 w-4' />
      Admin
    </Button>
  )
}

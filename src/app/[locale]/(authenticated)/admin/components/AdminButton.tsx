'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../../../../api/components/ui/Button'
import { IconSettings } from '../icons'
import { useAdminCheck } from '@/hooks/useAdminCheck'
import { useCallback, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AdminButton() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAdmin, isLoading } = useAdminCheck()
  const [isNavigating, setIsNavigating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // Defer button rendering until we're sure about admin status
  useEffect(() => {
    if (!isLoading && isAdmin) {
      setShouldRender(true)
    } else {
      setShouldRender(false)
    }
  }, [isLoading, isAdmin])

  const handleAdminClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      console.log('AdminButton: Click attempt', {
        isAdmin,
        isLoading,
        pathname,
        isNavigating,
        shouldRender,
      })

      if (isLoading || !isAdmin || isNavigating || !shouldRender) {
        console.log('AdminButton: Click blocked', {
          isLoading,
          isAdmin,
          isNavigating,
          shouldRender,
        })
        return
      }

      // If we're already on an admin page, don't navigate
      if (pathname?.startsWith('/admin')) {
        console.log('AdminButton: Already on admin page')
        return
      }

      try {
        setIsNavigating(true)
        console.log('AdminButton: Starting navigation to admin')
        await router.push('/admin')
      } catch (error) {
        console.error('AdminButton: Navigation failed', error)
      } finally {
        // Reset navigation state after a delay
        setTimeout(() => setIsNavigating(false), 1000)
      }
    },
    [isAdmin, isLoading, pathname, router, isNavigating, shouldRender]
  )

  // Don't render until we're sure about admin status
  if (!shouldRender) {
    console.log('AdminButton: Not showing', { isLoading, isAdmin, shouldRender })
    return null
  }

  console.log('AdminButton: Rendering', { isAdmin, pathname, isNavigating, shouldRender })
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

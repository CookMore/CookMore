'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useCallback, useRef } from 'react'

const ADMIN_WALLET = '0x1920F5b512634DE346100b025382c04eEA8Bbc67'

export function useAdminCheck() {
  const { user, ready, authenticated } = usePrivy()
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigationInProgress = useRef(false)
  const initialCheckComplete = useRef(false)

  // Central admin check logic
  const checkAdmin = useCallback(() => {
    if (!ready || !authenticated) return false
    return user?.wallet?.address?.toLowerCase() === ADMIN_WALLET.toLowerCase()
  }, [ready, authenticated, user?.wallet?.address])

  // Effect for initial admin status check
  useEffect(() => {
    if (!ready || initialCheckComplete.current) return

    console.log('useAdminCheck: Initial Status Check', {
      ready,
      authenticated,
      walletAddress: user?.wallet?.address,
      pathname,
    })

    const adminStatus = checkAdmin()
    console.log('useAdminCheck: Initial Check Result', { adminStatus })

    setIsAdmin(adminStatus)
    setIsLoading(false)
    initialCheckComplete.current = true

    // If we're on an admin route and not admin, redirect immediately
    const isAdminRoute = pathname?.startsWith('/admin')
    if (isAdminRoute && !adminStatus && !navigationInProgress.current) {
      console.log('useAdminCheck: Initial redirect - not admin')
      navigationInProgress.current = true
      router.replace('/')
    }
  }, [ready, authenticated, user?.wallet?.address, checkAdmin, pathname, router])

  // Effect for subsequent admin status updates
  useEffect(() => {
    if (!ready || !initialCheckComplete.current) return

    const adminStatus = checkAdmin()
    if (adminStatus !== isAdmin) {
      console.log('useAdminCheck: Status Update', { previous: isAdmin, new: adminStatus })
      setIsAdmin(adminStatus)
    }
  }, [ready, checkAdmin, isAdmin])

  // Effect for route protection
  useEffect(() => {
    if (!ready || isLoading || !initialCheckComplete.current) return

    const isAdminRoute = pathname?.startsWith('/admin')
    console.log('useAdminCheck: Route Protection Check', {
      isAdminRoute,
      isAdmin,
      pathname,
      navigationInProgress: navigationInProgress.current,
    })

    if (isAdminRoute && !isAdmin && !navigationInProgress.current) {
      console.log('useAdminCheck: Unauthorized access, redirecting')
      navigationInProgress.current = true
      router.replace('/')
    }

    // Reset navigation flag when leaving admin routes
    if (!isAdminRoute) {
      navigationInProgress.current = false
    }
  }, [ready, isLoading, isAdmin, pathname, router])

  // Reset flags when component unmounts
  useEffect(() => {
    return () => {
      navigationInProgress.current = false
      initialCheckComplete.current = false
    }
  }, [])

  return {
    isAdmin: isAdmin ?? false,
    isLoading: isLoading || !ready || !initialCheckComplete.current,
    checkAdmin,
  }
}

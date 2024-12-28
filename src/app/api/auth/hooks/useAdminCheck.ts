'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState, useCallback, useRef } from 'react'

const ADMIN_WALLET = '0x1920F5b512634DE346100b025382c04eEA8Bbc67'

export function useAdminCheck() {
  const { user, ready, authenticated } = usePrivy()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initialCheckComplete = useRef(false)

  // Central admin check logic
  const checkAdmin = useCallback(() => {
    if (!ready || !authenticated || !user?.wallet?.address) {
      console.log('Admin check: Not ready', { ready, authenticated, wallet: user?.wallet?.address })
      return false
    }

    const isAdminWallet = user.wallet.address.toLowerCase() === ADMIN_WALLET.toLowerCase()
    console.log('Admin check:', {
      userWallet: user.wallet.address.toLowerCase(),
      adminWallet: ADMIN_WALLET.toLowerCase(),
      isAdmin: isAdminWallet,
    })
    return isAdminWallet
  }, [ready, authenticated, user?.wallet?.address])

  // Effect for admin status check
  useEffect(() => {
    if (!ready || initialCheckComplete.current) {
      console.log('Admin check skipped:', {
        ready,
        initialCheckComplete: initialCheckComplete.current,
      })
      return
    }

    const adminStatus = checkAdmin()
    console.log('Initial admin check:', { adminStatus })
    setIsAdmin(adminStatus)
    setIsLoading(false)
    initialCheckComplete.current = true
  }, [ready, checkAdmin])

  // Effect for subsequent admin status updates
  useEffect(() => {
    if (!ready || !initialCheckComplete.current) return

    const adminStatus = checkAdmin()
    if (adminStatus !== isAdmin) {
      console.log('Admin status changed:', { previous: isAdmin, new: adminStatus })
      setIsAdmin(adminStatus)
    }
  }, [ready, checkAdmin, isAdmin])

  // Reset flags when component unmounts
  useEffect(() => {
    return () => {
      console.log('Admin check cleanup')
      initialCheckComplete.current = false
    }
  }, [])

  const result = {
    isAdmin: isAdmin ?? false,
    isLoading: isLoading || !ready || !initialCheckComplete.current,
    checkAdmin,
  }

  console.log('Admin check result:', result)
  return result
}

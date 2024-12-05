'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/routes'
import { useProfile } from './useProfile'
import { useEffect } from 'react'
import { useWalletState } from './useWalletState'

export function useAuth() {
  const { login, logout, authenticated, user } = usePrivy()
  const router = useRouter()
  const { profile } = useProfile()
  const { address: walletAddress } = useWalletState()

  // Watch for authentication and wallet connection changes
  useEffect(() => {
    // If not authenticated or wallet disconnected, redirect to home
    if (!authenticated || !walletAddress) {
      router.push(ROUTES.MARKETING.HOME)
      return
    }

    // If authenticated but no profile, redirect to profile creation
    if (!profile) {
      router.push(ROUTES.AUTH.PROFILE.CREATE)
      return
    }

    // If authenticated with profile, allow access to kitchen
    router.push(ROUTES.AUTH.KITCHEN.HOME)
  }, [authenticated, walletAddress, profile, router])

  // Enhanced logout to handle both Privy and wallet
  const handleLogout = async () => {
    await logout()
    router.push(ROUTES.MARKETING.HOME)
  }

  return {
    login,
    logout: handleLogout,
    authenticated: authenticated && !!walletAddress,
    user,
    hasProfile: !!profile,
  }
}

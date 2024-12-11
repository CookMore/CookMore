'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'
import { useProfileData } from '@/lib/auth/hooks/useProfile'
import { useProfileRegistry } from '@/lib/web3/hooks/contracts/useProfileRegistry'
import { ROUTES } from '@/lib/routes'

export function useAuth() {
  const { login, logout, authenticated, ready, user } = usePrivy()
  const {
    profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfileData(user?.wallet?.address)
  const { getProfileTier } = useProfileRegistry()
  const router = useRouter()

  const handleLogin = useCallback(async () => {
    try {
      await login()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }, [login])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      router.push(ROUTES.MARKETING.HOME)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [logout, router])

  // Only redirect to profile creation if we're authenticated and have all the necessary data
  useEffect(() => {
    if (!ready || !authenticated || profileLoading) return

    // If we have a wallet address but no profile, redirect to profile creation
    if (user?.wallet?.address && !profile) {
      getProfileTier(user.wallet.address).then((tier) => {
        router.push(`${ROUTES.AUTH.PROFILE.CREATE}?tier=${tier}`)
      })
    }
  }, [ready, authenticated, profileLoading, profile, user?.wallet?.address, getProfileTier, router])

  return {
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: authenticated && ready,
    ready: ready && !profileLoading,
    user,
    profile,
    isLoading: !ready || profileLoading,
    error: profileError,
    getProfileTier,
  }
}

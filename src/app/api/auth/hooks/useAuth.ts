'use client'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useCallback } from 'react'
import { ROUTES } from '@/app/api/routes/routes'

export function useAuth() {
  const router = useRouter()
  const { ready, authenticated, user, login: privyLogin, logout: privyLogout } = usePrivy()

  // Handle auth state changes
  useEffect(() => {
    const handleAuthChange = async () => {
      console.log('Auth state check:', {
        ready,
        authenticated,
        hasUser: !!user,
        hasWallet: !!user?.wallet,
        walletAddress: user?.wallet?.address?.substring(0, 10),
      })

      if (ready && authenticated && user?.wallet?.address) {
        console.log('User authenticated, checking profile')

        try {
          // Check if user has a profile
          const profileResponse = await fetch(`/api/profile/address/${user.wallet.address}`)
          console.log('Profile check response:', {
            status: profileResponse.status,
            ok: profileResponse.ok,
            walletAddress: user.wallet.address,
          })

          const hasProfile = profileResponse.ok
          console.log('Profile check result:', { hasProfile })

          if (!hasProfile) {
            console.log('No profile found, redirecting to create')
            router.push(ROUTES.AUTH.PROFILE.CREATE)
          }
        } catch (error) {
          console.error('Error checking profile:', error)
        }
      }
    }

    handleAuthChange()
  }, [ready, authenticated, user, router])

  const handleLogin = useCallback(async () => {
    try {
      console.log('Initiating Privy login')
      await privyLogin()
    } catch (error) {
      console.error('Login error:', error)
    }
  }, [privyLogin])

  const handleLogout = useCallback(async () => {
    try {
      await privyLogout()
      router.push(ROUTES.MARKETING.HOME)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [privyLogout, router])

  return {
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: authenticated,
    isLoading: !ready,
    ready,
    user,
    hasProfile: !!user?.wallet?.address, // Use wallet address as initial check
  }
}

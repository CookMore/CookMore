'use client'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useCallback, useRef } from 'react'
import { ROUTES } from '@/app/api/routes/routes'

export function useAuth() {
  const router = useRouter()
  const { ready, authenticated, user, login: privyLogin, logout: privyLogout } = usePrivy()
  const checkInProgress = useRef(false)
  const lastCheck = useRef<string | null>(null)

  // Handle auth state changes
  useEffect(() => {
    const handleAuthChange = async () => {
      // Prevent concurrent checks and duplicate checks for the same state
      if (checkInProgress.current) return
      const currentState = `${ready}-${authenticated}-${user?.wallet?.address}`
      if (currentState === lastCheck.current) return

      checkInProgress.current = true
      lastCheck.current = currentState

      console.log('Auth state check:', {
        ready,
        authenticated,
        hasUser: !!user,
        hasWallet: !!user?.wallet,
        walletAddress: user?.wallet?.address?.substring(0, 10),
      })

      try {
        if (ready && authenticated && user?.wallet?.address) {
          console.log('User authenticated, checking profile')

          try {
            // Add cache-busting query parameter
            const timestamp = Date.now()
            const profileResponse = await fetch(
              `/api/profile/address/${user.wallet.address}?t=${timestamp}`,
              {
                headers: {
                  'Cache-Control': 'no-cache',
                  Pragma: 'no-cache',
                },
              }
            )

            console.log('Profile check response:', {
              status: profileResponse.status,
              ok: profileResponse.ok,
              walletAddress: user.wallet.address,
            })

            if (!profileResponse.ok) {
              console.error('Profile check failed:', profileResponse.status)
              return
            }

            const profileData = await profileResponse.json()
            console.log('Profile check result:', profileData)

            const hasTier =
              profileData.tierStatus?.currentTier > 0 ||
              profileData.tierStatus?.hasGroup ||
              profileData.tierStatus?.hasPro ||
              profileData.tierStatus?.hasOG

            console.log('Tier status:', {
              hasTier,
              tierStatus: profileData.tierStatus,
            })

            const hasProfile = profileData.data !== null

            if (hasTier && !hasProfile) {
              console.log('Has tier but no profile, redirecting to create')
              router.push(ROUTES.AUTH.PROFILE.CREATE)
            } else if (!hasTier) {
              console.log('No tier found, redirecting to marketing')
              router.push(ROUTES.MARKETING.HOME)
            }
          } catch (error) {
            console.error('Error checking profile:', error)
          }
        }
      } finally {
        checkInProgress.current = false
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

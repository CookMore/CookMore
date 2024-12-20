import { useRouter } from 'next/router'
import { useEffect, useRef, useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { ROUTES } from '../constants/routes'
import Cookies from 'js-cookie'

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
        currentPath: window.location.pathname,
      })

      try {
        if (!ready) {
          console.log('Auth not ready yet')
          return
        }

        if (!authenticated) {
          console.log('User not authenticated, redirecting to marketing')
          Cookies.remove('HAS_PROFILE')
          router.push(ROUTES.MARKETING.HOME)
          return
        }

        if (!user?.wallet?.address) {
          console.log('No wallet address found')
          Cookies.remove('HAS_PROFILE')
          return
        }

        // Skip profile check if we're on the profile creation page
        const isOnProfileCreate = window.location.pathname.includes(ROUTES.AUTH.PROFILE.CREATE)
        if (isOnProfileCreate) {
          console.log('Already on profile creation page, skipping profile check')
          return
        }

        // Only proceed with profile check if we're not on the profile creation page
        try {
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

          if (!profileResponse.ok) {
            if (profileResponse.status === 404) {
              console.log('No profile found, redirecting to create')
              Cookies.remove('HAS_PROFILE')
              if (!isOnProfileCreate) {
                router.push(ROUTES.AUTH.PROFILE.CREATE)
              }
              return
            }
            throw new Error(`Profile check failed: ${profileResponse.status}`)
          }

          const profileData = await profileResponse.json()
          console.log('Profile check result:', {
            data: profileData.data,
            tierStatus: profileData.tierStatus,
          })

          if (!profileData.data && !isOnProfileCreate) {
            console.log('No profile found, redirecting to create')
            Cookies.remove('HAS_PROFILE')
            router.push(ROUTES.AUTH.PROFILE.CREATE)
          } else if (profileData.data) {
            console.log('User has profile, setting cookie')
            Cookies.set('HAS_PROFILE', 'true', { sameSite: 'strict' })
          }
        } catch (error) {
          console.error('Profile check error:', error)
          Cookies.remove('HAS_PROFILE')
          // Only redirect on error if we're not already on the create page
          if (!isOnProfileCreate) {
            router.push(ROUTES.AUTH.PROFILE.CREATE)
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
      Cookies.remove('HAS_PROFILE')
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
    hasProfile: !!user?.wallet?.address,
  }
}

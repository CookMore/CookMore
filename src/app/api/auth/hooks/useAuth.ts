'use client'
import { useRouter } from 'next/navigation'
import { usePrivy, User } from '@privy-io/react-auth'
import { useEffect, useCallback, useRef, useState } from 'react'
import { ROUTES } from '@/app/api/routes/routes'
import { contractService } from '@/app/[locale]/(authenticated)/profile/services/client/contract.service'
import { setHasProfileCookie, clearHasProfileCookie } from '@/app/api/utils/cookies'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { profileCacheService } from '@/app/[locale]/(authenticated)/profile/services/offline/profile-cache.service'
import { COOKIE_NAMES } from '@/app/api/auth/constants'
import { setCookie, clearCookie } from '@/app/api/utils/client-cookies'

interface ContractServiceResponse {
  success: boolean
  data?: any
  tierStatus?: {
    actualTier: ProfileTier
  }
}

// Define public routes that don't require auth
const PUBLIC_ROUTES = [
  ROUTES.MARKETING.HOME,
  ROUTES.MARKETING.FEATURES,
  ROUTES.MARKETING.DISCOVER,
  ROUTES.MARKETING.PRICING,
]

interface UseAuthResult {
  isLoading: boolean
  hasProfile: boolean | null
  error: Error | null
  currentTier: ProfileTier
  checkProfileExists: (address: string) => Promise<boolean>
  handleProfileCreated: () => Promise<void>
  handleProfileDeleted: () => Promise<void>
  login: () => void
  logout: () => Promise<void>
  isAuthenticated: boolean
  ready: boolean
  user: User | null
  isAdmin: boolean
}

export function useAuth(): UseAuthResult {
  const router = useRouter()
  const {
    ready: privyReady,
    authenticated,
    user,
    login: privyLogin,
    logout: privyLogout,
  } = usePrivy()

  const [isLoading, setIsLoading] = useState(false)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [currentTier, setCurrentTier] = useState<ProfileTier>(ProfileTier.FREE)
  const [isAdmin, setIsAdmin] = useState(false)
  const mountedRef = useRef(false)

  // Function to check profile existence
  const checkProfileExists = useCallback(async (address: string) => {
    try {
      const exists = await contractService.checkProfileExists(address)
      return exists
    } catch (error) {
      console.error('Error checking profile:', error)
      return false
    }
  }, [])

  // Function to update profile state
  const updateProfileState = useCallback(async () => {
    if (!user?.wallet?.address || !mountedRef.current) return

    try {
      setIsLoading(true)
      const exists = await checkProfileExists(user.wallet.address)

      if (exists) {
        setHasProfile(true)
        setHasProfileCookie(true)

        // Get cached profile data
        const cachedProfile = await profileCacheService.getCachedProfile(user.wallet.address)
        if (cachedProfile) {
          setCurrentTier(cachedProfile.tier || ProfileTier.FREE)
          const adminStatus = await hasRequiredRole(user.wallet.address, ROLES.ADMIN)
          setIsAdmin(adminStatus)
        }
      } else {
        setHasProfile(false)
        clearHasProfileCookie()
      }

      // Set wallet address cookie
      setCookie('WALLET_ADDRESS', user.wallet.address)
    } catch (error) {
      console.error('Error updating profile state:', error)
      setError(error as Error)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [user?.wallet?.address, checkProfileExists])

  // Effect to initialize state
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Effect to handle authentication changes
  useEffect(() => {
    if (privyReady) {
      if (authenticated && user?.wallet?.address) {
        updateProfileState()
      } else {
        setHasProfile(null)
        setCurrentTier(ProfileTier.FREE)
        setIsAdmin(false)
        setIsLoading(false)
        clearHasProfileCookie()
        clearCookie('WALLET_ADDRESS')
      }
    }
  }, [privyReady, authenticated, user?.wallet?.address, updateProfileState])

  const handleProfileCreated = useCallback(async () => {
    await updateProfileState()
  }, [updateProfileState])

  const handleProfileDeleted = useCallback(async () => {
    setHasProfile(false)
    setCurrentTier(ProfileTier.FREE)
    setIsAdmin(false)
    clearHasProfileCookie()
  }, [])

  const login = useCallback(() => {
    privyLogin()
  }, [privyLogin])

  const logout = useCallback(async () => {
    try {
      await privyLogout()
      setHasProfile(null)
      setCurrentTier(ProfileTier.FREE)
      setIsAdmin(false)
      clearHasProfileCookie()
      clearCookie('WALLET_ADDRESS')
      router.push(ROUTES.MARKETING.HOME)
    } catch (error) {
      console.error('Logout error:', error)
      // Force navigation even if logout fails
      router.push(ROUTES.MARKETING.HOME)
    }
  }, [privyLogout, router])

  return {
    isLoading,
    hasProfile,
    error,
    currentTier,
    checkProfileExists,
    handleProfileCreated,
    handleProfileDeleted,
    login,
    logout,
    isAuthenticated: authenticated,
    ready: privyReady,
    user,
    isAdmin,
  }
}

'use client'
import { useRouter } from 'next/navigation'
import { usePrivy, User } from '@privy-io/react-auth'
import { useEffect, useCallback, useState } from 'react'
import { ROUTES } from '@/app/api/routes/routes'
import { contractService } from '@/app/[locale]/(authenticated)/profile/services/client/contract.service'
import { setHasProfileCookie, clearHasProfileCookie } from '@/app/api/utils/cookies'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { COOKIE_NAMES } from '@/app/api/auth/constants'
import { setCookie, clearCookie } from '@/app/api/utils/client-cookies'

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

  const checkProfileExists = useCallback(async (address: string) => {
    try {
      const exists = await contractService.checkProfileExists(address)
      console.log('Profile exists:', exists)
      return exists
    } catch (error) {
      console.error('Error checking profile:', error)
      return false
    }
  }, [])

  const updateProfileState = useCallback(async () => {
    if (!user?.wallet?.address) return

    try {
      setIsLoading(true)
      console.log('Updating profile state for address:', user.wallet.address)
      const exists = await checkProfileExists(user.wallet.address)

      if (exists) {
        setHasProfile(true)
        setHasProfileCookie(true)
        setCurrentTier(ProfileTier.FREE)
        setIsAdmin(false)
        console.log('Profile found, setting state.')
      } else {
        setHasProfile(false)
        clearHasProfileCookie()
        console.log('Profile not found, clearing state.')
      }

      setCookie('WALLET_ADDRESS', user.wallet.address)
    } catch (error) {
      console.error('Error updating profile state:', error)
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.wallet?.address, checkProfileExists])

  useEffect(() => {
    if (privyReady) {
      console.log('Privy ready:', privyReady)
      if (authenticated && user?.wallet?.address) {
        console.log('User authenticated:', authenticated)
        updateProfileState()
      } else {
        setHasProfile(null)
        setCurrentTier(ProfileTier.FREE)
        setIsAdmin(false)
        setIsLoading(false)
        clearHasProfileCookie()
        clearCookie(COOKIE_NAMES.WALLET_ADDRESS as 'WALLET_ADDRESS')
        console.log('User not authenticated, clearing state.')
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
      clearCookie(COOKIE_NAMES.WALLET_ADDRESS as 'WALLET_ADDRESS')
      router.push(ROUTES.MARKETING.HOME)
    } catch (error) {
      console.error('Logout error:', error)
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

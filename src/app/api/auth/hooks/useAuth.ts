'use client'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useCallback } from 'react'
import { ROUTES } from '@/app/api/routes/routes'

export function useAuth() {
  const router = useRouter()
  const { ready, authenticated, user, login: privyLogin, logout: privyLogout } = usePrivy()

  const handleLogin = useCallback(async () => {
    try {
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
    hasProfile: !!user?.profile,
  }
}

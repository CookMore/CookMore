'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export interface AuthUser {
  id: string
  email?: {
    address: string
    verified: boolean
  }
  wallet?: {
    address: string
    chainId: number
  }
  google?: {
    email: string
    name: string
  }
  github?: {
    username: string
    email: string
  }
  createdAt: Date
  linkedAccounts: Array<{
    type: string
    id: string
  }>
}

export function useAuth() {
  const {
    ready,
    authenticated,
    user,
    login,
    logout: privyLogout,
    createWallet,
    linkWallet,
    unlinkWallet,
    connectWallet,
    exportWallet,
  } = usePrivy()
  const router = useRouter()

  const logout = useCallback(async () => {
    await privyLogout()
    router.push('/')
  }, [privyLogout, router])

  const getUser = useCallback((): AuthUser | null => {
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      wallet: user.wallet,
      google: user.google,
      github: user.github,
      createdAt: user.createdAt,
      linkedAccounts: user.linkedAccounts,
    }
  }, [user])

  return {
    user: getUser(),
    authenticated,
    ready,
    isLoading: !ready,
    login,
    logout,
  }
}

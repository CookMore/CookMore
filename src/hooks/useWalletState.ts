'use client'

import { useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/routes'

export function useWalletState() {
  const { user, logout } = usePrivy()
  const router = useRouter()
  const address = user?.wallet?.address

  useEffect(() => {
    // Check if window.ethereum exists (MetaMask is installed)
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        // If no accounts, user has disconnected their wallet
        if (!accounts.length) {
          console.log('Wallet disconnected, logging out...')
          await logout()
          router.push(ROUTES.MARKETING.HOME)
        }
      }

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload()
      }

      // Subscribe to accounts change
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      // Subscribe to chain change
      window.ethereum.on('chainChanged', handleChainChanged)

      // Cleanup listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [logout, router])

  return { address }
}

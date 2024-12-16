'use client'

import { useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { getAccessControlContract } from '@/app/api/web3/contracts'
import { toast } from 'sonner'

// Define error types
interface ContractError extends Error {
  reason?: string
}

// Define common roles as constants
export const ROLES = {
  ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000',
  METADATA_MANAGER: '0x109d2839f0e9c0989a65f47c368d7b5e99e4d7ccf6f4e87443bad305e3c76f8e',
  PROFILE_MANAGER: '0x2d46c56e9f7e96c2c1cfc78c45b65c1e93bb34de2c4ba58e7bc3896fd245e1d6',
} as const

export function useAccessControl() {
  const { user } = usePrivy()

  // Check if an address has a specific role
  const hasRole = useCallback(
    async (role: string, address?: string) => {
      if (!window.ethereum) return false

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = await getAccessControlContract(signer)
        const targetAddress = address || user?.wallet?.address

        if (!targetAddress) return false

        return await contract.hasRole(role, targetAddress)
      } catch (error) {
        console.error('Error checking role:', error)
        return false
      }
    },
    [user?.wallet?.address]
  )

  // Grant a role to an address
  const grantRole = useCallback(
    async (role: string, address: string) => {
      if (!window.ethereum || !user?.wallet?.address) {
        throw new Error('Wallet not connected')
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = await getAccessControlContract(signer)

        // Check if caller has admin role
        const isAdmin = await hasRole(ROLES.ADMIN, user.wallet.address)
        if (!isAdmin) {
          throw new Error('Caller does not have admin rights')
        }

        const tx = await contract.grantRole(role, address)
        await provider.waitForTransaction(tx.hash)
        toast.success('Successfully granted role to address')

        return tx
      } catch (error) {
        const contractError = error as ContractError
        toast.error(contractError.reason || contractError.message || 'Failed to grant role')
        throw error
      }
    },
    [hasRole, toast, user?.wallet?.address]
  )

  // Revoke a role from an address
  const revokeRole = useCallback(
    async (role: string, address: string) => {
      if (!window.ethereum || !user?.wallet?.address) {
        throw new Error('Wallet not connected')
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = await getAccessControlContract(signer)

        // Check if caller has admin role
        const isAdmin = await hasRole(ROLES.ADMIN, user.wallet.address)
        if (!isAdmin) {
          throw new Error('Caller does not have admin rights')
        }

        const tx = await contract.revokeRole(role, address)
        await provider.waitForTransaction(tx.hash)
        toast.success('Successfully revoked role from address')

        return tx
      } catch (error) {
        const contractError = error as ContractError
        toast.error(contractError.reason || contractError.message || 'Failed to revoke role')
        throw error
      }
    },
    [hasRole, toast, user?.wallet?.address]
  )

  // Check if the current user has admin rights
  const isAdmin = useCallback(async () => {
    if (!user?.wallet?.address) return false
    return hasRole(ROLES.ADMIN, user.wallet.address)
  }, [user?.wallet?.address, hasRole])

  // Check if the current user can manage metadata
  const canManageMetadata = useCallback(async () => {
    if (!user?.wallet?.address) return false
    const [isUserAdmin, isMetadataManager] = await Promise.all([
      hasRole(ROLES.ADMIN, user.wallet.address),
      hasRole(ROLES.METADATA_MANAGER, user.wallet.address),
    ])
    return isUserAdmin || isMetadataManager
  }, [user?.wallet?.address, hasRole])

  // Check if the current user can manage profiles
  const canManageProfiles = useCallback(async () => {
    if (!user?.wallet?.address) return false
    const [isUserAdmin, isProfileManager] = await Promise.all([
      hasRole(ROLES.ADMIN, user.wallet.address),
      hasRole(ROLES.PROFILE_MANAGER, user.wallet.address),
    ])
    return isUserAdmin || isProfileManager
  }, [user?.wallet?.address, hasRole])

  return {
    hasRole,
    grantRole,
    revokeRole,
    isAdmin,
    canManageMetadata,
    canManageProfiles,
    ROLES,
  }
}

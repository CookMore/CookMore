'use client'

import { useCallback } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useWalletClient, usePublicClient } from 'wagmi'
import { getAccessControlContract } from '@/lib/web3/contracts'
import { useToast } from '@/hooks/use-toast'

// Define common roles as constants
export const ROLES = {
  ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000',
  METADATA_MANAGER: '0x109d2839f0e9c0989a65f47c368d7b5e99e4d7ccf6f4e87443bad305e3c76f8e',
  PROFILE_MANAGER: '0x2d46c56e9f7e96c2c1cfc78c45b65c1e93bb34de2c4ba58e7bc3896fd245e1d6',
} as const

export function useAccessControl() {
  const { user } = usePrivy()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { toast } = useToast()

  // Check if an address has a specific role
  const hasRole = useCallback(
    async (role: string, address?: string) => {
      if (!walletClient) return false

      try {
        const contract = getAccessControlContract(walletClient)
        const targetAddress = address || user?.wallet?.address

        if (!targetAddress) return false

        return await contract.read.hasRole([role, targetAddress])
      } catch (error) {
        console.error('Error checking role:', error)
        return false
      }
    },
    [walletClient, user?.wallet?.address]
  )

  // Grant a role to an address
  const grantRole = useCallback(
    async (role: string, address: string) => {
      if (!walletClient || !user?.wallet?.address) {
        throw new Error('Wallet not connected')
      }

      try {
        const contract = getAccessControlContract(walletClient)

        // Check if caller has admin role
        const isAdmin = await hasRole(ROLES.ADMIN, user.wallet.address)
        if (!isAdmin) {
          throw new Error('Caller does not have admin rights')
        }

        const tx = await contract.write.grantRole([role, address])
        await publicClient.waitForTransactionReceipt({ hash: tx })

        toast({
          title: 'Role Granted',
          description: 'Successfully granted role to address',
          variant: 'success',
        })

        return tx
      } catch (error) {
        toast({
          title: 'Error Granting Role',
          description: error instanceof Error ? error.message : 'Failed to grant role',
          variant: 'error',
        })
        throw error
      }
    },
    [walletClient, publicClient, user?.wallet?.address, hasRole, toast]
  )

  // Revoke a role from an address
  const revokeRole = useCallback(
    async (role: string, address: string) => {
      if (!walletClient || !user?.wallet?.address) {
        throw new Error('Wallet not connected')
      }

      try {
        const contract = getAccessControlContract(walletClient)

        // Check if caller has admin role
        const isAdmin = await hasRole(ROLES.ADMIN, user.wallet.address)
        if (!isAdmin) {
          throw new Error('Caller does not have admin rights')
        }

        const tx = await contract.write.revokeRole([role, address])
        await publicClient.waitForTransactionReceipt({ hash: tx })

        toast({
          title: 'Role Revoked',
          description: 'Successfully revoked role from address',
          variant: 'success',
        })

        return tx
      } catch (error) {
        toast({
          title: 'Error Revoking Role',
          description: error instanceof Error ? error.message : 'Failed to revoke role',
          variant: 'error',
        })
        throw error
      }
    },
    [walletClient, publicClient, user?.wallet?.address, hasRole, toast]
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

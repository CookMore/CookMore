'use client'

import { useState } from 'react'
import { useContract } from './useContract'
import { PROFILE_SYSTEM_ABI } from '@/lib/web3/abis'
import { getAddresses } from '@/lib/web3/utils/addresses'
import type { ProfileFormData } from '@/app/api/types/profile'
import { toast } from 'sonner'
import { useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { getEthersProvider, walletClientToSigner } from '@/lib/web3/utils/providers'

export function useProfileSystem() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: walletClient } = useWalletClient()
  const addresses = getAddresses()
  const { contract: wagmiContract, write, read } = useContract('PROFILE_SYSTEM', PROFILE_SYSTEM_ABI)

  const createProfile = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)

      if (walletClient) {
        // Use ethers.js for write operations
        const signer = walletClientToSigner(walletClient)
        const contract = new ethers.Contract(addresses.PROFILE_SYSTEM, PROFILE_SYSTEM_ABI, signer)

        const tx = await contract.createProfile(data)
        await tx.wait()
        toast.success('Profile created successfully')
        return { success: true, hash: tx.hash }
      } else {
        // Fallback to wagmi
        const hash = await write('createProfile', [data])
        toast.success('Profile created successfully')
        return { success: true, hash }
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Failed to create profile')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getProfile = async (profileId: string) => {
    try {
      setIsLoading(true)
      // Use ethers.js for read operations
      const provider = getEthersProvider()
      const contract = new ethers.Contract(addresses.PROFILE_SYSTEM, PROFILE_SYSTEM_ABI, provider)
      return await contract.getProfile(profileId)
    } catch (error) {
      console.error('Error getting profile:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createProfile,
    getProfile,
    isLoading,
    contract: wagmiContract,
  }
}

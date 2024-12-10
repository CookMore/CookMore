'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { ProfileTier } from '@/types/profile'
import type { ProfileMetadata } from '@/types/profile'
import { ipfsService } from '@/lib/services/ipfs-service'
import {
  getProfileRegistryContract,
  getMetadataContract,
  getSigner,
  getProNFTContract,
  getGroupNFTContract,
} from '@/lib/web3/contracts'
import { ethers } from 'ethers'
import { PROFILE_REGISTRY_ABI } from '@/lib/web3/abis/ProfileRegistry'
import { getNetworkConfig, getEthersNetwork, getRpcUrl } from '@/lib/web3/network'

export function useProfileRegistry() {
  const getProfileTier = useCallback(async (address: string): Promise<ProfileTier> => {
    try {
      const rpcUrl = getRpcUrl()
      if (!rpcUrl) {
        console.error('RPC URL not configured')
        return ProfileTier.FREE
      }

      // Get network configuration
      const network = getEthersNetwork()
      const config = getNetworkConfig()

      // Use ethers v6 syntax with environment-aware configuration
      const provider = new ethers.JsonRpcProvider(rpcUrl, network)

      // Verify network connection
      const connectedNetwork = await provider.getNetwork()
      console.log('Connected to network:', {
        chainId: connectedNetwork.chainId,
        name: connectedNetwork.name,
      })

      const contract = new ethers.Contract(
        config.contracts.profileRegistry,
        PROFILE_REGISTRY_ABI,
        provider
      )

      try {
        // First check if the address has a profile
        const hasProfile = await contract.hasProfile(address)
        if (!hasProfile) {
          console.log('No profile found for address:', address)
          return ProfileTier.FREE
        }

        // Get the profile details
        const profile = await contract.getProfile(address)
        console.log('Profile found:', profile)

        // Profile tier is stored in the profile struct
        return profile.tier || ProfileTier.FREE
      } catch (contractError) {
        console.error('Error checking profile:', contractError)
        return ProfileTier.FREE
      }
    } catch (error) {
      console.error('Error setting up provider:', error)
      // Default to Free tier on error
      return ProfileTier.FREE
    }
  }, [])

  const createProfile = useCallback(
    async (metadata: ProfileMetadata & { tier: ProfileTier }, tier: ProfileTier) => {
      try {
        const signer = await getSigner()
        const contract = await getProfileRegistryContract(signer)
        const metadataContract = await getMetadataContract(signer)

        // Upload metadata to IPFS
        const metadataURI = await ipfsService.uploadProfileMetadata(metadata, tier)

        // Convert tier to numeric value for contract
        let tierValue: number
        switch (tier) {
          case 'Free':
            tierValue = 0
            break
          case 'Pro':
            tierValue = 1
            break
          case 'Group':
            tierValue = 2
            break
          default:
            throw new Error('Invalid profile tier')
        }

        // Create metadata record first
        const metadataTx = await metadataContract.createMetadata(metadataURI)
        await metadataTx.wait()

        // Then create the profile with the metadata URI
        const tx = await contract.createProfile(metadataURI, tierValue)
        const receipt = await tx.wait()

        toast.success('Profile created', {
          description: 'Your profile has been created successfully.',
        })

        return receipt
      } catch (error: any) {
        console.error('Error creating profile:', error)
        toast.error('Error creating profile', {
          description: error.message || 'Something went wrong',
        })
        throw error
      }
    },
    [toast]
  )

  const updateProfile = useCallback(
    async (metadata: ProfileMetadata & { tier: ProfileTier }, tier: ProfileTier) => {
      try {
        const signer = await getSigner()
        const contract = await getProfileRegistryContract(signer)
        const metadataContract = await getMetadataContract(signer)

        // Upload to IPFS and get metadata URI
        const metadataURI = await ipfsService.uploadProfileMetadata(metadata, tier)

        // Convert tier to numeric value
        let tierValue: number
        switch (tier) {
          case 'Free':
            tierValue = 0
            break
          case 'Pro':
            tierValue = 1
            break
          case 'Group':
            tierValue = 2
            break
          default:
            throw new Error('Invalid tier')
        }

        // Update both contracts
        const [profileTx, metadataTx] = await Promise.all([
          contract.updateProfile(metadataURI, tierValue),
          metadataContract.updateMetadata(metadata.profileId, metadataURI),
        ])

        await Promise.all([profileTx.wait(), metadataTx.wait()])

        toast.success('Profile updated', {
          description: 'Your profile has been updated successfully.',
        })
      } catch (error: any) {
        console.error('Error updating profile:', error)
        toast.error('Error updating profile', {
          description: error.message || 'Something went wrong',
        })
        throw error
      }
    },
    [toast]
  )

  const getProfile = useCallback(async (profileId: string) => {
    try {
      const contract = await getProfileRegistryContract()
      const profile = await contract.getProfile(profileId)
      return profile
    } catch (error) {
      console.error('Error getting profile:', error)
      throw error
    }
  }, [])

  return {
    createProfile,
    updateProfile,
    getProfile,
    getProfileTier,
  }
}

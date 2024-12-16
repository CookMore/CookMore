'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { PROFILE_REGISTRY_ABI } from '@/lib/web3/abis'
import { useMetadataContract } from './useMetadataContract'
import { ipfsService } from '@/lib/services/ipfs-service'
import { ProfileTier } from '@/app/api/types/profile'
import type { ProfileMetadata } from '@/app/api/types/profile'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { useTranslations } from 'next-intl'
import { getEthersProvider, walletClientToSigner } from '@/lib/web3/utils/providers'
import { getAddresses } from '@/lib/web3/utils/addresses'
import { useNFTTiers } from '../features/useNFTTiers'

// Get the registry address from addresses utility
const addresses = getAddresses()
const PROFILE_REGISTRY_ADDRESS = addresses.PROFILE_REGISTRY

export interface ProfileRegistryHookResult {
  createProfile: (
    metadata: ProfileMetadata & { tier: ProfileTier },
    tier: ProfileTier
  ) => Promise<string>
  updateProfile: (
    metadata: ProfileMetadata & { tier: ProfileTier },
    tier: ProfileTier
  ) => Promise<string>
  getProfile: (profileId: string) => Promise<any>
  getProfileTier: (address: string) => Promise<ProfileTier>
  contract: ethers.Contract | null
  isLoading: boolean
}

export function useProfileRegistry(): ProfileRegistryHookResult {
  const t = useTranslations('profile')
  const { data: walletClient } = useWalletClient()
  const { currentTier } = useNFTTiers()
  const { createMetadata, updateMetadata } = useMetadataContract()
  const { address } = useAccount()

  const getContract = useCallback(
    (withSigner = false) => {
      try {
        if (withSigner && !walletClient) {
          throw new Error('Wallet not connected')
        }

        const provider = getEthersProvider()
        const signer = walletClient ? walletClientToSigner(walletClient) : provider

        return new ethers.Contract(
          PROFILE_REGISTRY_ADDRESS,
          PROFILE_REGISTRY_ABI,
          withSigner ? signer : provider
        )
      } catch (error) {
        console.error('Error getting contract:', error)
        return null
      }
    },
    [walletClient]
  )

  const getProfileTier = useCallback(
    async (address: string): Promise<ProfileTier> => {
      try {
        toast.loading(t('tier.checking'))
        const contract = getContract()
        if (!contract) throw new Error('Contract not initialized')

        const profile = await contract.getProfile(address)
        console.log('Profile found:', profile)

        if (!profile || !profile.exists) {
          console.log('No profile found for address:', address)
          toast.success(t('tier.checked'))
          return ProfileTier.FREE
        }

        toast.success(t('tier.checked'))
        return profile.tier || ProfileTier.FREE
      } catch (error) {
        // If contract call fails, it means the profile doesn't exist
        console.log('No profile found for address:', address)
        toast.success(t('tier.checked'))
        return ProfileTier.FREE
      }
    },
    [getContract, t]
  )

  const createProfile = useCallback(
    async (metadata: ProfileMetadata & { tier: ProfileTier }, tier: ProfileTier) => {
      try {
        // Verify tier eligibility
        if (tier !== currentTier) {
          throw new Error(t('errors.needProNFT'))
        }

        toast.loading(t('create.uploading'))
        const metadataURI = await ipfsService.uploadJson({
          ...metadata,
          tier,
          timestamp: Date.now(),
        })

        const tierValue = {
          [ProfileTier.FREE]: 0,
          [ProfileTier.PRO]: 1,
          [ProfileTier.GROUP]: 2,
        }[tier]

        toast.loading(t('create.metadata'))
        await createMetadata(Number(metadata.profileId), metadata)

        const contract = getContract(true)
        if (!contract) throw new Error('Contract not initialized')

        toast.loading(t('create.profile'))
        const tx = await contract.createProfile(metadataURI, tierValue)
        await tx.wait()

        toast.success(t('create.success'))
        return tx.hash
      } catch (error) {
        console.error('Error creating profile:', error)
        toast.error(t('create.error'))
        throw error
      }
    },
    [createMetadata, getContract, currentTier, t]
  )

  const updateProfile = useCallback(
    async (metadata: ProfileMetadata & { tier: ProfileTier }, tier: ProfileTier) => {
      try {
        // Verify tier eligibility
        if (tier !== currentTier) {
          throw new Error(t('errors.needProNFT'))
        }

        toast.loading(t('update.uploading'))
        const metadataURI = await ipfsService.uploadJson({
          ...metadata,
          tier,
          timestamp: Date.now(),
        })

        toast.loading(t('update.metadata'))
        await updateMetadata(Number(metadata.profileId), metadata)

        const contract = getContract(true)
        if (!contract) throw new Error('Contract not initialized')

        toast.loading(t('update.profile'))
        const tx = await contract.updateProfile(metadataURI)
        await tx.wait()

        toast.success(t('update.success'))
        return tx.hash
      } catch (error) {
        console.error('Error updating profile:', error)
        toast.error(t('update.error'))
        throw error
      }
    },
    [updateMetadata, getContract, currentTier, t]
  )

  const getProfile = useCallback(
    async (profileId: string) => {
      try {
        toast.loading(t('profile.loading'))
        const contract = getContract()
        if (!contract) throw new Error('Contract not initialized')

        const profile = await contract.getProfile(profileId)
        toast.success(t('profile.loaded'))
        return profile
      } catch (error) {
        console.error('Error getting profile:', error)
        toast.error(t('profile.error'))
        throw error
      }
    },
    [getContract, t]
  )

  console.log('[useProfileRegistry Contract] State:', {
    contractAddress: getContract()?.address,
    userAddress: address,
    timestamp: new Date().toISOString(),
  })

  // Add contract call logging
  const hasProfile = async (address: string) => {
    console.log('[useProfileRegistry Contract] Checking profile:', address)
    try {
      const result = await getContract().hasProfile(address)
      console.log('[useProfileRegistry Contract] Profile check result:', result)
      return result
    } catch (error) {
      console.error('[useProfileRegistry Contract] Error checking profile:', error)
      return false
    }
  }

  return {
    createProfile,
    updateProfile,
    getProfile,
    getProfileTier,
    contract: getContract() || null,
    isLoading: false,
  }
}

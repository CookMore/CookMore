'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { useContract } from './useContract'
import { PROFILE_REGISTRY_ABI } from '@/lib/web3/abis'
import { useMetadataContract } from './useMetadataContract'
import { ipfsService } from '@/lib/services/ipfs-service'
import { ProfileTier } from '@/types/profile'
import type { ProfileMetadata } from '@/types/profile'
import { usePublicClient, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { useTranslations } from 'next-intl'
import { getEthersProvider, walletClientToSigner } from '@/lib/web3/utils/providers'
import { getAddresses } from '@/lib/web3/utils/addresses'
import { useNFTTiers } from '../features/useNFTTiers'

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
  contract: ReturnType<typeof useContract>['contract']
  isLoading: boolean
}

export function useProfileRegistry(): ProfileRegistryHookResult {
  const t = useTranslations('profile')
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const addresses = getAddresses()
  const { currentTier } = useNFTTiers()

  const {
    contract: wagmiContract,
    write,
    read,
  } = useContract('PROFILE_REGISTRY', PROFILE_REGISTRY_ABI)
  const { createMetadata, updateMetadata } = useMetadataContract()

  const getProfileTier = useCallback(
    async (address: string): Promise<ProfileTier> => {
      try {
        toast.loading(t('tier.checking'))
        const provider = getEthersProvider()
        const contract = new ethers.Contract(
          addresses.PROFILE_REGISTRY,
          PROFILE_REGISTRY_ABI,
          provider
        )

        const hasProfile = await contract.hasProfile(address)
        if (!hasProfile) {
          console.log('No profile found for address:', address)
          return ProfileTier.FREE
        }

        const profile = await contract.getProfile(address)
        console.log('Profile found:', profile)

        toast.success(t('tier.checked'))
        return profile.tier || ProfileTier.FREE
      } catch (error) {
        console.error('Error checking profile:', error)
        toast.error(t('tier.error'))
        return ProfileTier.FREE
      }
    },
    [addresses.PROFILE_REGISTRY, t]
  )

  const createProfile = useCallback(
    async (metadata: ProfileMetadata & { tier: ProfileTier }, tier: ProfileTier) => {
      try {
        // Verify tier eligibility
        if (tier !== currentTier) {
          throw new Error(t('tier.mismatch'))
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
        await createMetadata(metadata.profileId, metadata)

        if (walletClient) {
          const signer = walletClientToSigner(walletClient)
          const contract = new ethers.Contract(
            addresses.PROFILE_REGISTRY,
            PROFILE_REGISTRY_ABI,
            signer
          )

          toast.loading(t('create.profile'))
          const tx = await contract.createProfile(metadataURI, tierValue)
          await tx.wait()

          toast.success(t('create.success'))
          return tx.hash
        } else {
          const hash = await write('createProfile', [metadataURI, tierValue])
          toast.success(t('create.success'))
          return hash
        }
      } catch (error) {
        console.error('Error creating profile:', error)
        toast.error(t('create.error'))
        throw error
      }
    },
    [createMetadata, write, walletClient, addresses.PROFILE_REGISTRY, currentTier, t]
  )

  const updateProfile = useCallback(
    async (metadata: ProfileMetadata & { tier: ProfileTier }, tier: ProfileTier) => {
      try {
        // Verify tier eligibility
        if (tier !== currentTier) {
          throw new Error(t('tier.mismatch'))
        }

        toast.loading(t('update.uploading'))
        const metadataURI = await ipfsService.uploadJson({
          ...metadata,
          tier,
          timestamp: Date.now(),
        })

        toast.loading(t('update.metadata'))
        await updateMetadata(metadata.profileId, metadata)

        if (walletClient) {
          const signer = walletClientToSigner(walletClient)
          const contract = new ethers.Contract(
            addresses.PROFILE_REGISTRY,
            PROFILE_REGISTRY_ABI,
            signer
          )

          toast.loading(t('update.profile'))
          const tx = await contract.updateProfile(metadataURI)
          await tx.wait()

          toast.success(t('update.success'))
          return tx.hash
        } else {
          const hash = await write('updateProfile', [metadataURI])
          toast.success(t('update.success'))
          return hash
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        toast.error(t('update.error'))
        throw error
      }
    },
    [updateMetadata, write, walletClient, addresses.PROFILE_REGISTRY, currentTier, t]
  )

  const getProfile = useCallback(
    async (profileId: string) => {
      try {
        toast.loading(t('profile.loading'))

        if (walletClient) {
          const signer = walletClientToSigner(walletClient)
          const contract = new ethers.Contract(
            addresses.PROFILE_REGISTRY,
            PROFILE_REGISTRY_ABI,
            signer
          )

          const profile = await contract.getProfile(profileId)
          toast.success(t('profile.loaded'))
          return profile
        } else {
          const result = await read('getProfile', [profileId])
          toast.success(t('profile.loaded'))
          return result
        }
      } catch (error) {
        console.error('Error getting profile:', error)
        toast.error(t('profile.error'))
        throw error
      }
    },
    [read, walletClient, addresses.PROFILE_REGISTRY, t]
  )

  return {
    createProfile,
    updateProfile,
    getProfile,
    getProfileTier,
    contract: wagmiContract,
    isLoading: false,
  }
}

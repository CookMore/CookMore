'use client'

import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useNFTTiers } from '../../../tier/hooks/useNFTTiers'
import { useContract } from '@/app/api/web3/hooks/contracts'
import { useMetadataContract } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { profileIpfsService } from '../../services/profile-ipfs.service'
import {
  type ProfileFormData,
  type ProfileMetadata,
  ProfileTier,
  CURRENT_PROFILE_VERSION,
} from '@/app/[locale]/(authenticated)/profile/profile'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { PROFILE_REGISTRY_ABI } from '@/app/api/web3/abis/profile'
import { ethers } from 'ethers'

export function useProfileRegistry() {
  const t = useTranslations('common')
  const { address, isConnected } = useAccount()
  const { currentTier, isLoading: tiersLoading } = useNFTTiers()
  const { contract: profileContract } = useContract('PROFILE_REGISTRY', PROFILE_REGISTRY_ABI)
  const { createMetadata, updateMetadata } = useMetadataContract()

  const createProfile = useCallback(
    async (formData: ProfileFormData) => {
      try {
        if (!profileContract || !address) {
          throw new Error('Contract or wallet not initialized')
        }

        // Verify tier eligibility
        if (formData.tier !== currentTier) {
          throw new Error(t('errors.invalidTier'))
        }

        // Prepare metadata
        const metadata: ProfileMetadata = {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          attributes: {
            version: CURRENT_PROFILE_VERSION,
            tier: formData.tier,
            timestamp: Date.now(),
          },
        }

        // Upload metadata to IPFS
        toast.loading(t('create.uploading'))
        const metadataUri = await profileIpfsService.uploadProfileMetadata(metadata, formData.tier)

        // Create metadata contract entry
        toast.loading(t('create.metadata'))
        const metadataId = await createMetadata(metadata, address)

        // Create profile
        toast.loading(t('create.profile'))
        const contract = new ethers.Contract(
          profileContract.address,
          PROFILE_REGISTRY_ABI,
          profileContract.signer
        )
        const tx = await contract.createProfile(metadataUri, metadataId, formData.tier)
        await tx.wait()

        toast.success(t('create.success'))
        return tx.hash
      } catch (error) {
        console.error('Error creating profile:', error)
        toast.error(t('create.error'))
        throw error
      }
    },
    [profileContract, address, currentTier, createMetadata, t]
  )

  const updateProfile = useCallback(
    async (formData: ProfileFormData & { id: string }) => {
      try {
        if (!profileContract || !address) {
          throw new Error('Contract or wallet not initialized')
        }

        // Verify tier eligibility
        if (formData.tier !== currentTier) {
          throw new Error(t('errors.invalidTier'))
        }

        // Prepare metadata
        const metadata: ProfileMetadata = {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          attributes: {
            version: CURRENT_PROFILE_VERSION,
            tier: formData.tier,
            timestamp: Date.now(),
          },
        }

        // Upload metadata to IPFS
        toast.loading(t('update.uploading'))
        const metadataUri = await profileIpfsService.uploadProfileMetadata(metadata, formData.tier)

        // Update metadata contract entry
        toast.loading(t('update.metadata'))
        await updateMetadata(Number(formData.id), metadata)

        // Update profile
        toast.loading(t('update.profile'))
        const contract = new ethers.Contract(
          profileContract.address,
          PROFILE_REGISTRY_ABI,
          profileContract.signer
        )
        const tx = await contract.updateProfile(metadataUri)
        await tx.wait()

        toast.success(t('update.success'))
        return tx.hash
      } catch (error) {
        console.error('Error updating profile:', error)
        toast.error(t('update.error'))
        throw error
      }
    },
    [profileContract, address, currentTier, updateMetadata, t]
  )

  const getProfile = useCallback(
    async (profileId: string) => {
      try {
        if (!profileContract) {
          throw new Error('Contract not initialized')
        }

        toast.loading(t('loading'))
        const contract = new ethers.Contract(
          profileContract.address,
          PROFILE_REGISTRY_ABI,
          profileContract.provider
        )
        const profile = await contract.getProfile(profileId)

        // Fetch metadata from IPFS if available
        if (profile.metadataUri) {
          const metadata = await profileIpfsService.getProfileMetadata(profile.metadataUri)
          if (metadata) {
            profile.metadata = metadata
          }
        }

        toast.success(t('loaded'))
        return profile
      } catch (error) {
        console.error('Error getting profile:', error)
        toast.error(t('error'))
        throw error
      }
    },
    [profileContract, t]
  )

  return {
    createProfile,
    updateProfile,
    getProfile,
    isLoading: tiersLoading || !profileContract,
    contract: profileContract,
  }
}

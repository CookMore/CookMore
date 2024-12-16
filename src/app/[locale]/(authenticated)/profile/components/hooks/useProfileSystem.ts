'use client'

import { useState, useCallback } from 'react'
import { useContract } from '@/app/api/web3/hooks/contracts/useContract'
import { PROFILE_SYSTEM_ABI } from '@/app/api/web3/abis'
import { getAddresses } from '@/app/api/web3/utils/addresses'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'
import { toast } from 'sonner'
import { useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { getEthersProvider, walletClientToSigner } from '@/app/api/web3/utils/providers'
import { useTranslations } from 'next-intl'
import { profileIpfsService } from '../../services/profile-ipfs.service'

export function useProfileSystem() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: walletClient } = useWalletClient()
  const addresses = getAddresses()
  const { contract: wagmiContract, write } = useContract('PROFILE_SYSTEM', PROFILE_SYSTEM_ABI)
  const t = useTranslations('common')

  const createProfile = useCallback(
    async (data: ProfileFormData) => {
      setIsLoading(true)
      try {
        // Upload metadata to IPFS first
        toast.loading(t('create.uploading'))
        const metadataUri = await profileIpfsService.uploadProfileMetadata(data, data.tier)

        if (walletClient) {
          // Use ethers.js for write operations
          const signer = walletClientToSigner(walletClient)
          const contract = new ethers.Contract(addresses.PROFILE_SYSTEM, PROFILE_SYSTEM_ABI, signer)

          toast.loading(t('create.profile'))
          const tx = await contract.createProfile(metadataUri)
          await tx.wait()

          toast.success(t('create.success'))
          return { success: true, hash: tx.hash }
        } else {
          // Fallback to wagmi
          const hash = await write('createProfile', [metadataUri])
          toast.success(t('create.success'))
          return { success: true, hash }
        }
      } catch (error) {
        console.error('Error creating profile:', error)
        toast.error(t('create.error'))
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [walletClient, addresses, write, t]
  )

  const getProfile = useCallback(
    async (profileId: string) => {
      setIsLoading(true)
      try {
        toast.loading(t('loading'))
        // Use ethers.js for read operations
        const provider = getEthersProvider()
        const contract = new ethers.Contract(addresses.PROFILE_SYSTEM, PROFILE_SYSTEM_ABI, provider)
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
      } finally {
        setIsLoading(false)
      }
    },
    [addresses, t]
  )

  const updateProfile = useCallback(
    async (profileId: string, data: ProfileFormData) => {
      setIsLoading(true)
      try {
        // Upload updated metadata to IPFS
        toast.loading(t('update.uploading'))
        const metadataUri = await profileIpfsService.uploadProfileMetadata(data, data.tier)

        if (walletClient) {
          // Use ethers.js for write operations
          const signer = walletClientToSigner(walletClient)
          const contract = new ethers.Contract(addresses.PROFILE_SYSTEM, PROFILE_SYSTEM_ABI, signer)

          toast.loading(t('update.profile'))
          const tx = await contract.updateProfile(profileId, metadataUri)
          await tx.wait()

          toast.success(t('update.success'))
          return { success: true, hash: tx.hash }
        } else {
          // Fallback to wagmi
          const hash = await write('updateProfile', [profileId, metadataUri])
          toast.success(t('update.success'))
          return { success: true, hash }
        }
      } catch (error) {
        console.error('Error updating profile:', error)
        toast.error(t('update.error'))
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [walletClient, addresses, write, t]
  )

  return {
    createProfile,
    getProfile,
    updateProfile,
    isLoading,
    contract: wagmiContract,
  }
}

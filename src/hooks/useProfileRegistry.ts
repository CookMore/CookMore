'use client'

import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useToast } from '@/components/ui/use-toast'
import { ProfileTier } from '@/types/profile'
import type { ProfileMetadata } from '@/types/profile'
import { ipfsService } from '@/lib/services/ipfs-service'
import { getProfileRegistryContract, getMetadataContract, getSigner } from '@/lib/web3/contracts'

export function useProfileRegistry() {
  const { toast } = useToast()

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

        toast({
          title: 'Profile created!',
          description: 'Your profile has been created successfully.',
          variant: 'default',
        })

        return receipt
      } catch (error: any) {
        console.error('Error creating profile:', error)
        toast({
          title: 'Error creating profile',
          description: error.message || 'Something went wrong',
          variant: 'destructive',
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

        toast({
          title: 'Profile updated!',
          description: 'Your profile has been updated successfully.',
          variant: 'default',
        })
      } catch (error: any) {
        console.error('Error updating profile:', error)
        toast({
          title: 'Error updating profile',
          description: error.message || 'Something went wrong',
          variant: 'destructive',
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
  }
}

'use client'

import { useCallback, useTransition } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useContract } from './useContract'
import { METADATA_ABI } from '@/lib/web3/abis'
import { ipfsService } from '@/lib/services/ipfs-service'
import { toast } from 'sonner'
import type { ProfileMetadata } from '@/types/profile'
import { useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { 
  getEthersProvider, 
  walletClientToSigner 
} from '@/lib/web3/utils/providers'
import { getAddresses } from '@/lib/web3/utils/addresses'

export function useMetadataContract() {
  const { user } = usePrivy()
  const { data: walletClient } = useWalletClient()
  const addresses = getAddresses()
  const [isPending, startTransition] = useTransition()
  
  // Get wagmi contract instance
  const { contract: wagmiContract, write, read } = useContract('METADATA', METADATA_ABI)

  const prepareMetadata = useCallback(async (profileId: number, metadata: ProfileMetadata) => {
    // Handle media uploads to IPFS
    const processedMetadata = { ...metadata }

    if (metadata.avatar && metadata.avatar instanceof File) {
      const avatarUrl = await ipfsService.uploadFile(metadata.avatar)
      processedMetadata.avatar = avatarUrl
    }

    // Handle additional media (like gallery images)
    if (metadata.culinaryInfo?.gallery?.length) {
      const galleryPromises = metadata.culinaryInfo.gallery.map((img) =>
        img instanceof File ? ipfsService.uploadFile(img) : Promise.resolve(img)
      )
      const galleryUrls = await Promise.all(galleryPromises)
      processedMetadata.culinaryInfo.gallery = galleryUrls
    }

    // Upload notes or additional content to IPFS
    const ipfsNotesCID = await ipfsService.uploadJson({
      version: metadata.version,
      content: metadata.culinaryInfo,
      preferences: metadata.preferences,
      social: metadata.social,
    })

    return {
      processedMetadata,
      ipfsNotesCID,
    }
  }, [])

  const createMetadata = useCallback(
    async (profileId: number, metadata: ProfileMetadata) => {
      if (!user?.wallet?.address) {
        throw new Error('Wallet not connected')
      }

      startTransition(async () => {
        try {
          const { processedMetadata, ipfsNotesCID } = await prepareMetadata(profileId, metadata)

          if (walletClient) {
            // Use ethers.js for write operations
            const signer = walletClientToSigner(walletClient)
            const contract = new ethers.Contract(
              addresses.METADATA,
              METADATA_ABI,
              signer
            )

            const tx = await contract.createMetadata(
              profileId,
              processedMetadata.name,
              processedMetadata.bio || '',
              processedMetadata.avatar || '',
              ipfsNotesCID
            )
            await tx.wait()
            toast.success('Profile metadata created successfully')
            return tx.hash
          } else {
            // Fallback to wagmi
            const hash = await write('createMetadata', [
              profileId,
              processedMetadata.name,
              processedMetadata.bio || '',
              processedMetadata.avatar || '',
              ipfsNotesCID,
            ])
            toast.success('Profile metadata created successfully')
            return hash
          }
        } catch (error) {
          console.error('Error creating metadata:', error)
          toast.error('Failed to create metadata')
          throw error
        }
      })
    },
    [user?.wallet?.address, walletClient, write, prepareMetadata, addresses.METADATA]
  )

  const updateMetadata = useCallback(
    async (profileId: number, metadata: ProfileMetadata) => {
      if (!user?.wallet?.address) {
        throw new Error('Wallet not connected')
      }

      startTransition(async () => {
        try {
          const { processedMetadata, ipfsNotesCID } = await prepareMetadata(profileId, metadata)

          if (walletClient) {
            // Use ethers.js for write operations
            const signer = walletClientToSigner(walletClient)
            const contract = new ethers.Contract(
              addresses.METADATA,
              METADATA_ABI,
              signer
            )

            const tx = await contract.updateMetadata(
              profileId,
              processedMetadata.name,
              processedMetadata.bio || '',
              processedMetadata.avatar || '',
              ipfsNotesCID
            )
            await tx.wait()
            toast.success('Profile metadata updated successfully')
            return tx.hash
          } else {
            // Fallback to wagmi
            const hash = await write('updateMetadata', [
              profileId,
              processedMetadata.name,
              processedMetadata.bio || '',
              processedMetadata.avatar || '',
              ipfsNotesCID,
            ])
            toast.success('Profile metadata updated successfully')
            return hash
          }
        } catch (error) {
          console.error('Error updating metadata:', error)
          toast.error('Failed to update metadata')
          throw error
        }
      })
    },
    [user?.wallet?.address, walletClient, write, prepareMetadata, addresses.METADATA]
  )

  const getMetadata = useCallback(
    async (profileId: number) => {
      try {
        // Use ethers.js for read operations
        const provider = getEthersProvider()
        const contract = new ethers.Contract(
          addresses.METADATA,
          METADATA_ABI,
          provider
        )
        const metadata = await contract.getMetadata(profileId)

        // If the metadata includes an IPFS CID, fetch the additional data
        if (metadata.ipfsNotesCID) {
          const additionalData = await ipfsService.getJson(metadata.ipfsNotesCID)
          return {
            ...metadata,
            ...additionalData,
          }
        }

        return metadata
      } catch (error) {
        console.error('Error fetching metadata:', error)
        throw error
      }
    },
    [addresses.METADATA]
  )

  return {
    createMetadata,
    updateMetadata,
    getMetadata,
    isPending,
    contract: wagmiContract,
  }
}

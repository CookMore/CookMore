'use client'

import { useCallback, useTransition } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useWalletClient, usePublicClient } from 'wagmi'
import { getMetadataContract } from '@/lib/web3/contracts'
import { ipfsService } from '@/lib/services/ipfs-service'
import { useToast } from '@/hooks/use-toast'
import type { ProfileMetadata } from '@/types/profile'

export function useMetadataContract() {
  const { user } = usePrivy()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const prepareMetadata = useCallback(async (profileId: number, metadata: ProfileMetadata) => {
    // Handle media uploads to IPFS
    const processedMetadata = { ...metadata }

    if (metadata.avatar) {
      const avatarUrl = await ipfsService.uploadFile(metadata.avatar)
      processedMetadata.avatar = avatarUrl
    }

    // Handle additional media (like gallery images)
    if (metadata.culinaryInfo?.gallery?.length) {
      const galleryPromises = metadata.culinaryInfo.gallery.map((img) =>
        img ? ipfsService.uploadFile(img) : Promise.resolve('')
      )
      const galleryUrls = await Promise.all(galleryPromises)
      processedMetadata.culinaryInfo.gallery = galleryUrls
    }

    // Upload notes or additional content to IPFS if needed
    const ipfsNotesCID = await ipfsService.uploadMetadata({
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
      if (!walletClient) {
        throw new Error('Wallet client not initialized')
      }

      startTransition(async () => {
        try {
          const { processedMetadata, ipfsNotesCID } = await prepareMetadata(profileId, metadata)
          const contract = getMetadataContract(walletClient)

          const tx = await contract.write.createMetadata([
            profileId,
            processedMetadata.name,
            processedMetadata.bio || '',
            processedMetadata.avatar || '',
            ipfsNotesCID,
          ])

          await publicClient.waitForTransactionReceipt({ hash: tx })

          toast({
            title: 'Metadata Created',
            description: 'Your profile metadata has been successfully created.',
            variant: 'success',
          })

          return tx
        } catch (error) {
          toast({
            title: 'Metadata Creation Failed',
            description: error instanceof Error ? error.message : 'Unknown error occurred',
            variant: 'error',
          })
          throw error
        }
      })
    },
    [user?.wallet?.address, walletClient, publicClient, prepareMetadata, toast]
  )

  const updateMetadata = useCallback(
    async (profileId: number, metadata: ProfileMetadata) => {
      if (!user?.wallet?.address) {
        throw new Error('Wallet not connected')
      }
      if (!walletClient) {
        throw new Error('Wallet client not initialized')
      }

      startTransition(async () => {
        try {
          const { processedMetadata, ipfsNotesCID } = await prepareMetadata(profileId, metadata)
          const contract = getMetadataContract(walletClient)

          const tx = await contract.write.updateMetadata([
            profileId,
            processedMetadata.name,
            processedMetadata.bio || '',
            processedMetadata.avatar || '',
            ipfsNotesCID,
          ])

          await publicClient.waitForTransactionReceipt({ hash: tx })

          toast({
            title: 'Metadata Updated',
            description: 'Your profile metadata has been successfully updated.',
            variant: 'success',
          })

          return tx
        } catch (error) {
          toast({
            title: 'Metadata Update Failed',
            description: error instanceof Error ? error.message : 'Unknown error occurred',
            variant: 'error',
          })
          throw error
        }
      })
    },
    [user?.wallet?.address, walletClient, publicClient, prepareMetadata, toast]
  )

  const getMetadata = useCallback(
    async (profileId: number) => {
      if (!walletClient) {
        throw new Error('Wallet client not initialized')
      }

      try {
        const contract = getMetadataContract(walletClient)
        const metadata = await contract.read.getMetadata([profileId])

        // If the metadata includes an IPFS CID, fetch the additional data
        if (metadata.ipfsNotesCID) {
          const additionalData = await ipfsService.fetchMetadata(metadata.ipfsNotesCID)
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
    [walletClient]
  )

  return {
    createMetadata,
    updateMetadata,
    getMetadata,
    isPending,
  }
}

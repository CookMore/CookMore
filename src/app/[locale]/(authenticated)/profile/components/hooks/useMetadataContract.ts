'use client'

import { useCallback } from 'react'
import { useContract } from '../../../../../api/web3/hooks/contracts/useContract'
import { METADATA_ABI } from '@/app/api/web3/abis'
import { ethers } from 'ethers'
import type { ProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'

export function useMetadataContract() {
  const { contract: metadataContract } = useContract('METADATA', METADATA_ABI)

  const createMetadata = useCallback(
    async (metadata: ProfileMetadata, owner: string) => {
      if (!metadataContract) {
        throw new Error('Contract not initialized')
      }

      const contract = new ethers.Contract(
        metadataContract.address,
        METADATA_ABI,
        metadataContract.signer
      )

      const tx = await contract.createMetadata(
        owner,
        metadata.name,
        metadata.description || '',
        metadata.image || '',
        metadata.attributes?.ipfsNotesCID || ''
      )
      await tx.wait()
      return tx.hash
    },
    [metadataContract]
  )

  const updateMetadata = useCallback(
    async (profileId: number, metadata: ProfileMetadata) => {
      if (!metadataContract) {
        throw new Error('Contract not initialized')
      }

      const contract = new ethers.Contract(
        metadataContract.address,
        METADATA_ABI,
        metadataContract.signer
      )

      const tx = await contract.updateMetadata(
        profileId,
        metadata.name,
        metadata.description || '',
        metadata.image || '',
        metadata.attributes?.ipfsNotesCID || ''
      )
      await tx.wait()
      return tx.hash
    },
    [metadataContract]
  )

  const getMetadata = useCallback(
    async (profileId: number) => {
      if (!metadataContract) {
        throw new Error('Contract not initialized')
      }

      const contract = new ethers.Contract(
        metadataContract.address,
        METADATA_ABI,
        metadataContract.provider
      )

      return contract.getMetadata(profileId)
    },
    [metadataContract]
  )

  return {
    createMetadata,
    updateMetadata,
    getMetadata,
    contract: metadataContract,
  }
}

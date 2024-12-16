'use client'
import { useContractWrite } from 'wagmi'
import { METADATA_CONFIG } from './config'
import { type MetadataHookResult } from './types'

export function useMetadataContract(): MetadataHookResult {
  const { writeAsync: createMetadataWrite, isLoading: createLoading } = useContractWrite({
    ...METADATA_CONFIG,
    functionName: 'createMetadata',
  })

  const { writeAsync: updateMetadataWrite, isLoading: updateLoading } = useContractWrite({
    ...METADATA_CONFIG,
    functionName: 'updateMetadata',
  })

  const createMetadata = async (metadataURI: string) => {
    const tx = await createMetadataWrite({ args: [metadataURI] })
    return tx.hash
  }

  const updateMetadata = async (profileId: number, metadataURI: string) => {
    await updateMetadataWrite({ args: [profileId, metadataURI] })
  }

  return {
    createMetadata,
    updateMetadata,
    isLoading: createLoading || updateLoading,
  }
}

import { useState, useCallback } from 'react'
import { useIPFSUpload } from '../ipfs/useIPFS'
import { MetadataTransformer } from '../../../services/transformers/metadata.transformer'
import type { ProfileFormData } from '../../../profile'
import type { OnChainMetadata, IPFSMetadata } from '../../../types/metadata'

interface UseProfileMetadata {
  isProcessing: boolean
  error: string | null
  processFormData: (
    formData: ProfileFormData,
    avatar?: File
  ) => Promise<{
    onChainMetadata: OnChainMetadata
    ipfsMetadataCID: string
  }>
  validateMetadata: (metadata: IPFSMetadata | OnChainMetadata) => {
    valid: boolean
    errors?: string[]
  }
}

export function useProfileMetadata(): UseProfileMetadata {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { uploadFile, uploadMetadata, isUploading } = useIPFSUpload()

  const processFormData = useCallback(
    async (
      formData: ProfileFormData,
      avatar?: File
    ): Promise<{
      onChainMetadata: OnChainMetadata
      ipfsMetadataCID: string
    }> => {
      setIsProcessing(true)
      setError(null)

      try {
        // Upload avatar if provided
        let avatarCID = ''
        if (avatar) {
          avatarCID = await uploadFile(avatar)
        }

        // Transform form data to metadata
        const { onChainMetadata, ipfsMetadata } = await MetadataTransformer.transformFormData(
          formData,
          avatarCID
        )

        // Validate metadata before upload
        const onChainValidation = MetadataTransformer.validateMetadata(onChainMetadata)
        const ipfsValidation = MetadataTransformer.validateMetadata(ipfsMetadata)

        if (!onChainValidation.valid || !ipfsValidation.valid) {
          const errors = [...(onChainValidation.errors || []), ...(ipfsValidation.errors || [])]
          throw new Error(`Invalid metadata: ${errors.join(', ')}`)
        }

        // Upload IPFS metadata
        const ipfsMetadataCID = await uploadMetadata(ipfsMetadata)

        // Update on-chain metadata with IPFS CID
        onChainMetadata.ipfsNotesCID = ipfsMetadataCID

        return {
          onChainMetadata,
          ipfsMetadataCID,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to process metadata'
        setError(message)
        throw err
      } finally {
        setIsProcessing(false)
      }
    },
    [uploadFile, uploadMetadata]
  )

  const validateMetadata = useCallback((metadata: IPFSMetadata | OnChainMetadata) => {
    return MetadataTransformer.validateMetadata(metadata)
  }, [])

  return {
    isProcessing: isProcessing || isUploading,
    error,
    processFormData,
    validateMetadata,
  }
}

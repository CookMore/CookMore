import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'

export interface UploadProgress {
  fileName: string
  progress: number
}

interface UseRecipeIPFSUpload {
  isUploading: boolean
  uploadProgress: UploadProgress | null
  error: Error | null
  uploadRecipeImage: (file: File) => Promise<string>
}

export function useRecipeIPFSUpload(): UseRecipeIPFSUpload {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true)
    setError(null)
    setUploadProgress({ fileName: file.name, progress: 0 })

    try {
      const result = await ipfsService.uploadFile(file, (progress) => {
        setUploadProgress({ fileName: file.name, progress })
      })
      return result.cid
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload file')
      setError(error)
      toast.error(error.message)
      throw error
    } finally {
      setIsUploading(false)
      setUploadProgress(null)
    }
  }, [])

  const uploadRecipeImage = useCallback((file: File) => uploadFile(file), [uploadFile])

  return {
    isUploading,
    uploadProgress,
    error,
    uploadRecipeImage,
  }
}

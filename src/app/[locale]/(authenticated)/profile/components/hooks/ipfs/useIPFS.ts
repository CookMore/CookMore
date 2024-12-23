import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { ipfsService } from '../../../services/ipfs/ipfs.service'
import type { IPFSMetadata } from '../../../types/metadata'

export interface UploadProgress {
  fileName: string
  progress: number
}

interface UseIPFSUpload {
  isUploading: boolean
  uploadProgress: UploadProgress | null
  error: Error | null
  uploadAvatar: (file: File) => Promise<string>
  uploadBanner: (file: File) => Promise<string>
}

export function useIPFSUpload(): UseIPFSUpload {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const uploadFile = useCallback(async (file: File, type: 'avatar' | 'banner') => {
    setIsUploading(true)
    setError(null)
    setUploadProgress({ progress: 0 })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload file')
      }

      const { cid } = await response.json()
      return cid
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload file'))
      throw err
    } finally {
      setIsUploading(false)
      setUploadProgress(null)
    }
  }, [])

  const uploadAvatar = useCallback((file: File) => uploadFile(file, 'avatar'), [uploadFile])

  const uploadBanner = useCallback((file: File) => uploadFile(file, 'banner'), [uploadFile])

  return {
    isUploading,
    uploadProgress,
    error,
    uploadAvatar,
    uploadBanner,
  }
}

interface UseIPFSFetch {
  isLoading: boolean
  error: Error | null
  fetchMetadata: (cid: string) => Promise<IPFSMetadata>
  reset: () => void
}

export function useIPFSFetch(): UseIPFSFetch {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  const fetchMetadata = useCallback(async (cid: string): Promise<IPFSMetadata> => {
    setIsLoading(true)
    setError(null)
    try {
      return await ipfsService.fetchMetadata(cid)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch metadata')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    fetchMetadata,
    reset,
  }
}

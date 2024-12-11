'use client'

import { useState, useCallback } from 'react'
import { ipfsService } from '@/lib/services/ipfs-service'
import type { IpfsGateway } from '@/lib/web3/config/ipfs'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export interface IpfsHookResult {
  isLoading: boolean
  uploadProgress: number
  uploadFile: (file: File) => Promise<string>
  uploadJson: (data: any) => Promise<string>
  getFile: (cid: string) => Promise<Uint8Array>
  getJson: <T>(cid: string) => Promise<T>
  getUrl: (cid: string, gateway?: IpfsGateway) => string
}

export function useIpfs(): IpfsHookResult {
  const t = useTranslations('ipfs')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadFile = useCallback(async (file: File) => {
    try {
      setIsLoading(true)
      setUploadProgress(0)
      toast.loading(t('upload.start'))

      const cid = await ipfsService.uploadFile(file, {
        onProgress: (progress) => {
          setUploadProgress(progress)
          toast.loading(t('upload.progress', { progress }))
        }
      })

      toast.success(t('upload.success'))
      return cid
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      toast.error(t('upload.error'))
      throw error
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }, [t])

  const uploadJson = useCallback(async (data: any) => {
    try {
      setIsLoading(true)
      toast.loading(t('upload.start'))

      const cid = await ipfsService.uploadJson(data)
      toast.success(t('upload.success'))
      return cid
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error)
      toast.error(t('upload.error'))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [t])

  const getFile = useCallback(async (cid: string) => {
    try {
      setIsLoading(true)
      toast.loading(t('download.start'))

      const data = await ipfsService.getFile(cid)
      toast.success(t('download.success'))
      return data
    } catch (error) {
      console.error('Error getting file from IPFS:', error)
      toast.error(t('download.error'))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [t])

  const getJson = useCallback(async <T,>(cid: string): Promise<T> => {
    try {
      setIsLoading(true)
      toast.loading(t('download.start'))

      const data = await ipfsService.getJson<T>(cid)
      toast.success(t('download.success'))
      return data
    } catch (error) {
      console.error('Error getting JSON from IPFS:', error)
      toast.error(t('download.error'))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [t])

  const getUrl = useCallback((cid: string, gateway?: IpfsGateway) => {
    return ipfsService.getUrl(cid, gateway)
  }, [])

  return {
    isLoading,
    uploadProgress,
    uploadFile,
    uploadJson,
    getFile,
    getJson,
    getUrl,
  }
}

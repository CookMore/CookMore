'use client'

import { useState, useCallback } from 'react'
import { ipfsService } from '@/lib/services/ipfs-service'

export function useIpfs() {
  const [isLoading, setIsLoading] = useState(false)

  const uploadFile = useCallback(async (file: File) => {
    try {
      setIsLoading(true)
      const cid = await ipfsService.uploadFile(file)
      return cid
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadJson = useCallback(async (data: any) => {
    try {
      setIsLoading(true)
      const cid = await ipfsService.uploadJson(data)
      return cid
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getFile = useCallback(async (cid: string) => {
    try {
      setIsLoading(true)
      const data = await ipfsService.getFile(cid)
      return data
    } catch (error) {
      console.error('Error getting file from IPFS:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    uploadFile,
    uploadJson,
    getFile,
  }
}

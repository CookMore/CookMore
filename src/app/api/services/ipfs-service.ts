'use client'

import { create } from 'ipfs-http-client'
import { toast } from 'sonner'

// Types
export type IpfsGateway = 'gateway.pinata.cloud' | 'ipfs.io' | 'dweb.link' | 'cloudflare-ipfs.com'

interface IpfsUploadResult {
  cid: string
  url: string
}

class IPFSService {
  private defaultGateway: IpfsGateway = 'gateway.pinata.cloud'
  private apiKey: string
  private apiSecret: string
  private jwt: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
    this.apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET || ''
    this.jwt = process.env.NEXT_PUBLIC_PINATA_JWT || ''

    if (!this.apiKey || !this.apiSecret) {
      console.error('Pinata credentials not found')
    }
  }

  async uploadJson(data: unknown): Promise<IpfsUploadResult> {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.jwt}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const cid = `ipfs://${result.IpfsHash}`
      return {
        cid,
        url: this.getHttpUrl(cid),
      }
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      toast.error('Failed to upload data to IPFS')
      throw error
    }
  }

  async uploadFile(file: File): Promise<IpfsUploadResult> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.jwt}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const cid = `ipfs://${result.IpfsHash}`
      return {
        cid,
        url: this.getHttpUrl(cid),
      }
    } catch (error) {
      console.error('Error uploading file to IPFS:', error)
      toast.error('Failed to upload file to IPFS')
      throw error
    }
  }

  getHttpUrl(ipfsUrl: string, gateway?: IpfsGateway): string {
    if (!ipfsUrl) return ''
    const useGateway = gateway || this.defaultGateway
    const hash = ipfsUrl.replace('ipfs://', '')
    return `https://${useGateway}/ipfs/${hash}`
  }

  setDefaultGateway(gateway: IpfsGateway): void {
    this.defaultGateway = gateway
  }
}

export const ipfsService = new IPFSService()

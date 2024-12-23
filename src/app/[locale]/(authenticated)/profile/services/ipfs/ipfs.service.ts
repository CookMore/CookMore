import { toast } from 'sonner'
import type { IPFSMetadata } from '../../types/metadata'

export type IpfsGateway = 'gateway.pinata.cloud' | 'ipfs.io' | 'dweb.link' | 'cloudflare-ipfs.com'

interface IpfsUploadResult {
  cid: string
  url: string
}

class IPFSError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'IPFSError'
  }
}

export class IPFSService {
  private defaultGateway: IpfsGateway = 'gateway.pinata.cloud'
  private jwt: string

  constructor() {
    this.jwt = process.env.NEXT_PUBLIC_PINATA_JWT || ''
    if (!this.jwt) {
      console.warn('Pinata JWT not found')
    }
  }

  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<IpfsUploadResult> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      const uploadPromise = new Promise<IpfsUploadResult>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
          }
        })

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const result = JSON.parse(xhr.responseText)
            const cid = `ipfs://${result.IpfsHash}`
            resolve({
              cid,
              url: this.getHttpUrl(cid),
            })
          } else {
            reject(new IPFSError(`Upload failed with status ${xhr.status}`))
          }
        }

        xhr.onerror = () => {
          reject(new IPFSError('Network error during upload'))
        }
      })

      xhr.open('POST', 'https://api.pinata.cloud/pinning/pinFileToIPFS')
      xhr.setRequestHeader('Authorization', `Bearer ${this.jwt}`)
      xhr.send(formData)

      return await uploadPromise
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      if (error instanceof IPFSError) {
        toast.error(error.message)
        throw error
      }
      toast.error('Failed to upload file to IPFS')
      throw new IPFSError('Failed to upload file')
    }
  }

  async uploadMetadata(metadata: IPFSMetadata): Promise<IpfsUploadResult> {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.jwt}`,
        },
        body: JSON.stringify(metadata),
      })

      if (!response.ok) {
        throw new IPFSError(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const cid = `ipfs://${result.IpfsHash}`
      return {
        cid,
        url: this.getHttpUrl(cid),
      }
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error)
      if (error instanceof IPFSError) {
        toast.error(error.message)
        throw error
      }
      toast.error('Failed to upload metadata to IPFS')
      throw new IPFSError('Failed to upload metadata')
    }
  }

  async fetchMetadata(cid: string): Promise<IPFSMetadata> {
    try {
      const url = this.getHttpUrl(cid)
      const response = await fetch(url)

      if (!response.ok) {
        throw new IPFSError(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching metadata from IPFS:', error)
      if (error instanceof IPFSError) {
        toast.error(error.message)
        throw error
      }
      toast.error('Failed to fetch metadata from IPFS')
      throw new IPFSError('Failed to fetch metadata')
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

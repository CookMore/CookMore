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

  getHttpUrl(ipfsCid: string): string {
    console.log('IPFS Service - getHttpUrl input:', { ipfsCid })

    // If it's already a gateway URL, return as is
    if (ipfsCid.startsWith(`https://${this.defaultGateway}/ipfs/`)) {
      console.log('IPFS Service - URL is already in gateway format, returning as is:', { ipfsCid })
      return ipfsCid
    }

    // Remove any number of ipfs:// prefixes to handle potential double prefixing
    const cid = ipfsCid.replace(/^(ipfs:\/\/)+/, '')
    const url = `https://${this.defaultGateway}/ipfs/${cid}`
    console.log('IPFS Service - URL transformation:', {
      originalCid: ipfsCid,
      cleanedCid: cid,
      gateway: this.defaultGateway,
      finalUrl: url,
      hasIpfsPrefix: ipfsCid.startsWith('ipfs://'),
      urlLength: url.length,
    })
    return url
  }

  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<IpfsUploadResult> {
    if (!this.jwt) {
      const error = new IPFSError('Pinata JWT not configured')
      toast.error(error.message)
      throw error
    }

    if (!file) {
      const error = new IPFSError('No file provided for upload')
      toast.error(error.message)
      throw error
    }

    console.log('Starting file upload:', {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()

      const uploadPromise = new Promise<IpfsUploadResult>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
            console.log('Upload progress:', progress.toFixed(2) + '%')
          }
        })

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const result = JSON.parse(xhr.responseText)
            console.log('IPFS Service - Upload success:', {
              response: result,
              status: xhr.status,
              responseType: xhr.responseType,
            })

            const cid = `ipfs://${result.IpfsHash}`
            console.log('IPFS Service - Generated CID:', { cid })

            const url = this.getHttpUrl(cid)
            console.log('IPFS Service - Final result:', {
              cid,
              url,
              originalHash: result.IpfsHash,
            })

            resolve({ cid, url })
          } else {
            let errorMessage = `Upload failed with status ${xhr.status}`
            try {
              const errorResponse = JSON.parse(xhr.responseText)
              errorMessage = `${errorMessage}: ${errorResponse.message || errorResponse.error || 'Unknown error'}`
              console.error('Upload error response:', errorResponse)
            } catch (e) {
              console.error('Could not parse error response:', xhr.responseText)
            }
            reject(new IPFSError(errorMessage))
          }
        }

        xhr.onerror = () => {
          console.error('Network error during upload')
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

  setDefaultGateway(gateway: IpfsGateway): void {
    this.defaultGateway = gateway
  }
}

export const ipfsService = new IPFSService()

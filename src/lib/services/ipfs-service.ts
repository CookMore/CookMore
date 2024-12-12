import { ipfsClient, getIpfsUrl, type IpfsGateway } from '@/lib/web3/config/ipfs'
import { type ProfileMetadata } from '@/types/profile'

class IPFSService {
  private defaultGateway: IpfsGateway = 'pinata'

  async uploadFile(
    file: File,
    options?: { onProgress?: (progress: number) => void }
  ): Promise<string> {
    if (!ipfsClient) throw new Error('IPFS client not configured')

    try {
      const buffer = await file.arrayBuffer()
      const result = await ipfsClient.add(buffer, {
        progress: (prog) => options?.onProgress?.(Math.round((prog / file.size) * 100)),
      })
      return result.path
    } catch (error) {
      console.error('IPFS upload error:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  async uploadJson(data: any): Promise<string> {
    if (!ipfsClient) throw new Error('IPFS client not configured')

    try {
      const result = await ipfsClient.add(JSON.stringify(data))
      return result.path
    } catch (error) {
      console.error('IPFS JSON upload error:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  async getFile(cid: string): Promise<Uint8Array> {
    if (!ipfsClient) throw new Error('IPFS client not configured')

    try {
      const chunks = []
      for await (const chunk of ipfsClient.cat(cid)) {
        chunks.push(chunk)
      }
      return new Uint8Array(Buffer.concat(chunks))
    } catch (error) {
      console.error('IPFS download error:', error)
      throw new Error('Failed to download file from IPFS')
    }
  }

  async getJson<T>(cid: string): Promise<T> {
    const data = await this.getFile(cid)
    const text = new TextDecoder().decode(data)
    return JSON.parse(text)
  }

  getUrl(cid: string, gateway?: IpfsGateway): string {
    return getIpfsUrl(cid, gateway || this.defaultGateway)
  }

  setDefaultGateway(gateway: IpfsGateway) {
    this.defaultGateway = gateway
  }

  async getProfileMetadata(uri: string): Promise<ProfileMetadata | null> {
    try {
      const response = await fetch(this.resolveUri(uri))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data as ProfileMetadata
    } catch (error) {
      console.error('Error fetching profile metadata:', error)
      return null
    }
  }

  private resolveUri(uri: string): string {
    // Remove ipfs:// prefix if present
    const cid = uri.replace('ipfs://', '')
    // Use configured gateway
    return `${this.gateway}/ipfs/${cid}`
  }
}

export const ipfsService = new IPFSService()

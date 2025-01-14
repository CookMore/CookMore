import { toast } from 'sonner'
import type { IPFSMetadata } from '../../types/metadata'
import type { RecipeMetadata } from '../../types/recipe'

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

export class RecipeIPFSService {
  private defaultGateway: IpfsGateway = 'gateway.pinata.cloud'
  private jwt: string

  constructor() {
    this.jwt = process.env.NEXT_PUBLIC_IPFS_JWT || ''
  }

  getHttpUrl(ipfsCid: string): string {
    return `https://${this.defaultGateway}/ipfs/${ipfsCid}`
  }

  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<IpfsUploadResult> {
    // Implement file upload logic
    return { cid: '', url: '' }
  }

  async uploadMetadata(metadata: IPFSMetadata): Promise<IpfsUploadResult> {
    // Implement metadata upload logic
    return { cid: '', url: '' }
  }

  async fetchMetadata(cid: string): Promise<IPFSMetadata> {
    // Implement metadata fetching logic
    return {} as IPFSMetadata
  }

  setDefaultGateway(gateway: IpfsGateway): void {
    this.defaultGateway = gateway
  }

  generateDynamicRenderer(recipeData: RecipeMetadata): string {
    // Implement dynamic renderer generation logic
    return ''
  }
}

export const recipeIpfsService = new RecipeIPFSService()

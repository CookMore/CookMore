import { type Address } from 'viem'
import { METADATA_ABI } from '../../abis/profile'

export interface MetadataContract {
  address: Address
  abi: typeof METADATA_ABI
}

export interface MetadataHookResult {
  createMetadata: (metadataURI: string) => Promise<bigint>
  updateMetadata: (profileId: number, metadataURI: string) => Promise<void>
  isLoading: boolean
}

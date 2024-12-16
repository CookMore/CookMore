import { getChainConfig } from '../../config/chains'
import { PROFILE_REGISTRY_ABI, METADATA_ABI } from '../../abis/profile'
import { type ProfileRegistryContract } from './types'

export const PROFILE_REGISTRY_CONFIG: ProfileRegistryContract = {
  address: getChainConfig().contracts.PROFILE_REGISTRY,
  abi: PROFILE_REGISTRY_ABI,
}

export const METADATA_CONFIG = {
  address: getChainConfig().contracts.METADATA,
  abi: METADATA_ABI,
}

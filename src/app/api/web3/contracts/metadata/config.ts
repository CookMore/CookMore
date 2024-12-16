import { getChainConfig } from '../../config/chains'
import { METADATA_ABI } from '../../abis/profile'

export const METADATA_CONFIG = {
  address: getChainConfig().contracts.METADATA,
  abi: METADATA_ABI,
}

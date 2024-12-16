// Contract hooks
export * from './useContract'
export * from '../../../../[locale]/(authenticated)/profile/components/hooks/useMetadataContract'

// Types
export type { ContractHookResult } from './useContract'

// Re-export provider utilities
export {
  getEthersProvider,
  getEthersSigner,
  walletClientToSigner,
  wagmiProviderToEthers,
  getContract,
} from '../../utils/providers'

'use client'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { getChainConfig } from '../../config/chains'

export function useWalletState() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const config = getChainConfig()

  const isCorrectChain = chain?.id === config.chain.id

  return {
    address,
    isConnected,
    isCorrectChain,
    switchNetwork,
    chainId: config.chain.id,
  }
}

import {
  BrowserProvider,
  JsonRpcProvider,
  JsonRpcSigner,
  Contract,
  type Provider as EthersProvider,
  type Signer as EthersSigner,
} from 'ethers'
import { createPublicClient, http, type PublicClient, type WalletClient } from 'viem'
import { type Provider } from '@wagmi/core'
import { getChainConfig } from '../../blockchain/config/chains'

// Get the active chain configuration
const chainConfig = getChainConfig()

// Ethers.js provider
export const getEthersProvider = () => {
  const rpcUrl = chainConfig.chain.rpcUrls.default.http[0]
  return new JsonRpcProvider(rpcUrl)
}

// Ethers.js signer
export const getEthersSigner = async (provider?: EthersProvider) => {
  const ethersProvider = provider || getEthersProvider()
  const signer = await ethersProvider.getSigner()
  return signer
}

// Viem public client
export const getViemPublicClient = (): PublicClient => {
  return createPublicClient({
    chain: chainConfig.chain,
    transport: http(),
  })
}

// Convert Wagmi/Viem wallet client to ethers signer
export const walletClientToSigner = (walletClient: WalletClient) => {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new JsonRpcProvider(transport.url, network)
  return new JsonRpcSigner(provider, account.address)
}

// Convert Wagmi provider to ethers provider
export const wagmiProviderToEthers = (provider: Provider) => {
  const { chain, transport } = provider
  return new JsonRpcProvider(transport.url, {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  })
}

// Helper to get contract instance
export const getContract = (
  address: string,
  abi: any[],
  signerOrProvider?: EthersSigner | EthersProvider | WalletClient | PublicClient
) => {
  if (!signerOrProvider) {
    return new Contract(address, abi, getEthersProvider())
  }

  // Handle different types of signers/providers
  if ('signMessage' in signerOrProvider || 'getCode' in signerOrProvider) {
    return new Contract(address, abi, signerOrProvider)
  }

  // Convert Wagmi/Viem clients to ethers
  if ('account' in signerOrProvider) {
    return new Contract(address, abi, walletClientToSigner(signerOrProvider))
  }

  // Use viem public client
  return getViemPublicClient().getContract({
    address: address as `0x${string}`,
    abi,
  })
}

export type { PublicClient, WalletClient }

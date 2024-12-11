import { type BrowserProvider, type JsonRpcSigner } from 'ethers'
import { createPublicClient, http, type PublicClient, type WalletClient } from 'viem'
import { type Provider } from '@wagmi/core'
import { getChainConfig } from '../config/chains'

// Get the active chain configuration
const chainConfig = getChainConfig()

// Ethers.js provider
export const getEthersProvider = () => {
  const rpcUrl = chainConfig.chain.rpcUrls.default.http[0]
  return new ethers.JsonRpcProvider(rpcUrl)
}

// Ethers.js signer
export const getEthersSigner = async (provider?: ethers.Provider) => {
  const ethersProvider = provider || getEthersProvider()
  return new ethers.JsonRpcSigner(ethersProvider, await ethersProvider.getSigner().getAddress())
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
  const provider = new ethers.JsonRpcProvider(transport.url, network)
  return new ethers.JsonRpcSigner(provider, account.address)
}

// Convert Wagmi provider to ethers provider
export const wagmiProviderToEthers = (provider: Provider) => {
  const { chain, transport } = provider
  return new ethers.JsonRpcProvider(transport.url, {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  })
}

// Helper to get contract instance with either ethers or viem
export const getContract = (
  address: string,
  abi: any[],
  signerOrProvider?: ethers.Signer | ethers.Provider | WalletClient | PublicClient
) => {
  if (!signerOrProvider) {
    return new ethers.Contract(address, abi, getEthersProvider())
  }

  // Handle different types of signers/providers
  if (signerOrProvider instanceof ethers.Signer || signerOrProvider instanceof ethers.Provider) {
    return new ethers.Contract(address, abi, signerOrProvider)
  }

  // Convert Wagmi/Viem clients to ethers
  if ('account' in signerOrProvider) {
    return new ethers.Contract(address, abi, walletClientToSigner(signerOrProvider))
  }

  // Use viem public client
  return getViemPublicClient().getContract({
    address: address as `0x${string}`,
    abi,
  })
}

export type { PublicClient, WalletClient }

import { ethers } from 'ethers'
import { PROFILE_REGISTRY_ABI } from './abis/ProfileRegistry'
import { METADATA_ABI } from './abis/Metadata'
import {
  PROFILE_REGISTRY_ADDRESS,
  METADATA_ADDRESS,
  TIER_CONTRACT_ADDRESS,
  PRO_NFT_ADDRESS,
  GROUP_NFT_ADDRESS,
} from './addresses'

// Base network configuration
const CHAIN_ID = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 8453 : 84532

function getProvider() {
  // For browser environments
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }

  // Fallback to RPC URL
  const RPC_URL =
    process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
      ? 'https://mainnet.base.org'
      : 'https://sepolia.base.org'

  return new ethers.JsonRpcProvider(RPC_URL)
}

export async function getProfileRegistryContract(signer?: ethers.Signer) {
  const provider = getProvider()
  const network = await provider.getNetwork()

  if (network.chainId !== BigInt(CHAIN_ID)) {
    throw new Error(
      `Please switch to Base ${process.env.NEXT_PUBLIC_NETWORK} (Chain ID: ${CHAIN_ID})`
    )
  }

  return new ethers.Contract(PROFILE_REGISTRY_ADDRESS, PROFILE_REGISTRY_ABI, signer || provider)
}

export async function getMetadataContract(signer?: ethers.Signer) {
  const provider = getProvider()
  const network = await provider.getNetwork()

  if (network.chainId !== BigInt(CHAIN_ID)) {
    throw new Error(
      `Please switch to Base ${process.env.NEXT_PUBLIC_NETWORK} (Chain ID: ${CHAIN_ID})`
    )
  }

  return new ethers.Contract(METADATA_ADDRESS, METADATA_ABI, signer || provider)
}

// Helper to ensure we're on the right network
export async function ensureCorrectNetwork() {
  const provider = getProvider()
  const network = await provider.getNetwork()

  if (network.chainId !== BigInt(CHAIN_ID)) {
    throw new Error(
      `Please switch to Base ${process.env.NEXT_PUBLIC_NETWORK} (Chain ID: ${CHAIN_ID})`
    )
  }
}

// Helper to get a signer
export async function getSigner() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No ethereum provider found')
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  return provider.getSigner()
}

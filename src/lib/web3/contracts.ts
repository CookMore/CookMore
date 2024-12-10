import { ethers } from 'ethers'
import { PROFILE_REGISTRY_ABI } from './abis/ProfileRegistry'
import { METADATA_ABI } from './abis/Metadata'
import { TIER_CONTRACT_ABI, TIER_CONTRACT_ADDRESS } from './abis/TierContracts'
import {
  PROFILE_REGISTRY_ADDRESS,
  METADATA_ADDRESS,
  PRO_NFT_ADDRESS,
  GROUP_NFT_ADDRESS,
  ACCESS_CONTROL_ADDRESS,
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

export async function getTierContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  const provider = getProvider()
  const network = await provider.getNetwork()

  if (network.chainId !== BigInt(CHAIN_ID)) {
    throw new Error(
      `Please switch to Base ${process.env.NEXT_PUBLIC_NETWORK} (Chain ID: ${CHAIN_ID})`
    )
  }

  return new ethers.Contract(TIER_CONTRACT_ADDRESS, TIER_CONTRACT_ABI, signerOrProvider)
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

export const ACCESS_CONTROL_ABI = [
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function grantRole(bytes32 role, address account)',
  'function revokeRole(bytes32 role, address account)',
  'function pause()',
  'function unpause()',
  'function accessProFeature(uint256 tokenId)',
  'function accessGroupFeature(uint256 tokenId)',
] as const

export async function getAccessControlContract(signer?: ethers.Signer) {
  const provider = getProvider()
  const network = await provider.getNetwork()

  if (network.chainId !== BigInt(CHAIN_ID)) {
    throw new Error(
      `Please switch to Base ${process.env.NEXT_PUBLIC_NETWORK} (Chain ID: ${CHAIN_ID})`
    )
  }

  return new ethers.Contract(ACCESS_CONTROL_ADDRESS, ACCESS_CONTROL_ABI, signer || provider)
}

// Export the addresses
export {
  PROFILE_REGISTRY_ADDRESS,
  METADATA_ADDRESS,
  PRO_NFT_ADDRESS,
  GROUP_NFT_ADDRESS,
  ACCESS_CONTROL_ADDRESS,
} from './addresses'

export const getProNFTContract = async (signer?: Signer) => {
  const provider = signer ?? (await getProvider())
  return new Contract(addresses.proNFT, abis.proNFT, provider)
}

export const getGroupNFTContract = async (signer?: Signer) => {
  const provider = signer ?? (await getProvider())
  return new Contract(addresses.groupNFT, abis.groupNFT, provider)
}

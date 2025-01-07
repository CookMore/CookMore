'use server'

import { ethers } from 'ethers'
import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { profileABI } from '@/app/api/blockchain/abis'
import { cache } from 'react'
import { Profile } from '../../profile'
import { ProfileTier } from '../../profile'
import type { TierStatus, ProfileMetadata } from '../../profile'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { getTierStatus as getTierStatusFromContract } from '@/app/api/tiers/tiers'
import { decodeCreateProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'
import type { Abi } from 'viem'

// Log environment variables to ensure they are set correctly
console.log('NEXT_PUBLIC_BASE_MAINNET_RPC_URL:', process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL)
console.log('NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL:', process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)

// Initialize the providers with your specific RPC URLs
const mainnetProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL
)
const sepoliaProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
)

const providers = {
  mainnet: mainnetProvider,
  sepolia: sepoliaProvider,
}

// Function to select the appropriate provider
function getProvider(network: 'mainnet' | 'sepolia'): ethers.providers.JsonRpcProvider {
  return providers[network]
}

// Define the ABI for the ProfileCreated event
const profileCreatedAbi: Abi = [
  {
    type: 'event',
    name: 'ProfileCreated',
    inputs: [
      { indexed: true, name: 'user', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
      { indexed: false, name: 'uri', type: 'string' },
    ],
  },
]

// Helper function to get tier status
async function getTierStatus(address: string): Promise<TierStatus> {
  try {
    return await getTierStatusFromContract(address)
  } catch (error) {
    console.error('Error getting tier status:', error)
    return {
      hasGroup: false,
      hasPro: false,
      hasOG: false,
      currentTier: ProfileTier.FREE,
    }
  }
}

// Manual implementation of hexZeroPad
function hexZeroPad(value: string | undefined, length: number): string {
  if (!value) {
    throw new Error('Value is undefined')
  }

  // Remove '0x' prefix for length calculation
  const strippedValue = value.startsWith('0x') ? value.slice(2) : value

  if (strippedValue.length > length * 2) {
    // If the value is longer than the specified length, return it as is
    return value
  }

  // Pad the value with zeros
  return '0x' + strippedValue.padStart(length * 2, '0')
}

// Base implementation for server-side profile fetching
export async function getProfile(
  address: string,
  network: 'mainnet' | 'sepolia'
): Promise<ProfileMetadata | null> {
  console.log(`Starting getProfile for address: ${address} on ${network}`)

  try {
    const contractAddress = getContractAddress('PROFILE_REGISTRY')
    console.log('Contract address:', contractAddress)

    // Fetch logs using ethers.js
    const provider = getProvider(network)
    const logs = await provider.getLogs({
      address: contractAddress,
      topics: [null, hexZeroPad(address, 32)], // Use null for the event signature
    })

    if (logs.length === 0) {
      console.error('No logs found for the address')
      return null
    }

    const decodedMetadata = decodeCreateProfileEvent(logs[0], profileCreatedAbi as any)
    if (!decodedMetadata) {
      console.error('Failed to decode profile creation event')
      return null
    }

    console.log('Decoded Metadata:', decodedMetadata)
    return decodedMetadata
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

// Cached version for repeated calls
export async function getCachedProfile(
  address: string,
  network: 'mainnet' | 'sepolia'
): Promise<ProfileMetadata | null> {
  const cachedFn = cache((addr: string) => getProfile(addr, network))
  return cachedFn(address)
}

// Server actions for profile operations
export async function createProfile(metadata: Profile) {
  try {
    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })

    // TODO: Implement actual contract interaction
    return { success: true, hash: '0x' }
  } catch (error) {
    console.error('Error creating profile:', error)
    return { success: false, error: 'Failed to create profile' }
  }
}

export async function updateProfile(metadata: Profile) {
  try {
    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })

    // TODO: Implement actual contract interaction
    return { success: true, hash: '0x' }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function deleteProfile() {
  try {
    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })

    // TODO: Implement actual contract interaction
    return { success: true }
  } catch (error) {
    console.error('Error deleting profile:', error)
    return { success: false, error: 'Failed to delete profile' }
  }
}

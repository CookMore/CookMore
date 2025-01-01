'use server'

import { ethers } from 'ethers'
import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { profileABI } from '@/app/api/blockchain/abis'
import { cache } from 'react'
import { Profile } from '../../profile'
import { ProfileTier } from '../../profile'
import type { TierStatus } from '../../profile'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { checkRoleAccess } from '../../utils/role-utils'
import { getCookieNames } from '@/app/api/utils/cookies'
import { getTierStatus as getTierStatusFromContract } from '@/app/api/tiers/tiers'
import { decodeProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'
import { PROFILE_CREATED_SIGNATURE } from '@/app/[locale]/(authenticated)/profile/constants/constants'
import type { ProfileMetadata } from '../../profile'

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

const providers = [mainnetProvider, sepoliaProvider]

providers.forEach((provider, index) => {
  try {
    const url =
      index === 0
        ? process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL
        : process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
    if (url) {
      console.log(`Provider ${index} initialized with URL: ${url}`)
    } else {
      throw new Error(`Provider ${index} failed to initialize`)
    }
  } catch (error) {
    console.error(`Error initializing provider ${index}:`, error)
  }
})

// Define the ABI for the ProfileCreated event
const profileCreatedAbi = [
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

export interface ProfileResponse {
  success: boolean
  data: Profile | null
  error?: string
  tierStatus: TierStatus
  isAdmin?: boolean
  canManageProfiles?: boolean
  canManageMetadata?: boolean
}

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
export async function getProfile(address: string): Promise<ProfileResponse> {
  console.log('Starting getProfile for address:', address)

  try {
    const contractAddress = getContractAddress('PROFILE_REGISTRY')
    console.log('Contract address:', contractAddress)

    const logs = await fetchLogsWithFallback(address)

    console.log('Number of logs fetched:', logs.length)

    if (logs.length === 0) {
      console.log('No profile creation event found for address:', address)
      return {
        success: true,
        data: null,
        tierStatus: {
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: 0,
        },
      }
    }

    const decodedEvent = decodeProfileEvent(logs[0], profileCreatedAbi as any)
    console.log('Decoded event:', decodedEvent)

    const profileId = decodedEvent?.args?.[1]
    const metadataUri = decodedEvent?.args?.[2] as string

    if (!profileId || typeof metadataUri !== 'string') {
      console.error('Failed to decode profile creation event')
      return {
        success: true,
        data: null,
        tierStatus: {
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: 0,
        },
      }
    }

    const tierStatus = await getTierStatus(address)
    console.log('Tier status:', tierStatus)

    return {
      success: true,
      data: {
        exists: true,
        metadataUri: metadataUri,
        tier: 0,
        tokenId: profileId.toString(),
        owner: address,
        metadata: {
          name: 'Default Name',
          description: 'Default Description',
        } as ProfileMetadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        eventLog: {
          topics: Array.from(logs[0].topics),
          data: logs[0].data,
        },
      },
      tierStatus,
    }
  } catch (error) {
    console.error('Error in getProfile:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      tierStatus: {
        hasGroup: false,
        hasPro: false,
        hasOG: false,
        currentTier: 0,
      },
    }
  }
}

// Cached version for repeated calls
export async function getCachedProfile(address: string): Promise<ProfileResponse> {
  const cachedFn = cache(getProfile)
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

async function fetchLogsWithFallback(address: string): Promise<any[]> {
  if (!address) {
    throw new Error('Address is undefined')
  }

  for (const [index, provider] of providers.entries()) {
    try {
      const contractAddress = getContractAddress('PROFILE_REGISTRY')
      const logs = await provider.getLogs({
        address: contractAddress,
        topics: [PROFILE_CREATED_SIGNATURE, null, hexZeroPad(address, 32)],
        fromBlock: 0,
        toBlock: 'latest',
      })
      return logs
    } catch (error) {
      console.error(
        'Error fetching logs with provider:',
        index === 0
          ? process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL
          : process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
        error
      )
    }
  }
  throw new Error('All providers failed to fetch logs')
}

'use client'

import { getContract } from '@/lib/web3/client'
import { PROFILE_REGISTRY_ABI } from '@/lib/web3/abis'
import { PROFILE_REGISTRY_ADDRESS } from '@/lib/web3/addresses'
import { ipfsService } from './ipfs-service'
import { Interface, EventFilter } from 'ethers'
import { cache } from 'react'
import { defaultAvatarDataUrl } from './avatar'
import type {
  ProfileMetadata,
  ProfileTier,
  ProfileNFT,
  ProfileResponse,
  TransactionResponse,
  ServiceResponse,
} from '@/types/profile'

function getAuthToken() {
  const cookies = document.cookie.split(';')
  const privyToken = cookies.find((cookie) => cookie.trim().startsWith('privy-token='))
  return privyToken ? privyToken.split('=')[1].trim() : ''
}

// Restore the missing exports
export const getProfile = cache(async (): Promise<ProfileResponse> => {
  try {
    const token = getAuthToken()
    const response = await fetch('/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }
    const data = await response.json()
    if (!data.avatar) {
      data.avatar = defaultAvatarDataUrl
    }
    return data
  } catch (error) {
    throw new ProfileError('Failed to fetch profile', 'FETCH_ERROR', error as Error)
  }
})

export const createProfile = async (data: ProfileMetadata): Promise<ServiceResponse> => {
  try {
    const response = await fetch('/api/profile/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create profile')
    }
    return await response.json()
  } catch (error) {
    throw new ProfileError('Failed to create profile', 'CREATE_ERROR', error as Error)
  }
}

export const updateProfile = async (data: ProfileMetadata): Promise<ServiceResponse> => {
  try {
    const response = await fetch('/api/profile/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update profile')
    }
    return await response.json()
  } catch (error) {
    throw new ProfileError('Failed to update profile', 'UPDATE_ERROR', error as Error)
  }
}

export const upgradeProfile = async (tier: ProfileTier): Promise<TransactionResponse> => {
  try {
    const response = await fetch('/api/profile/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier }),
    })
    if (!response.ok) {
      throw new Error('Failed to upgrade profile')
    }
    return await response.json()
  } catch (error) {
    throw new ProfileError('Failed to upgrade profile', 'UPGRADE_ERROR', error as Error)
  }
}

// Error class definition
class ProfileError extends Error {
  constructor(message: string, public code: string, public originalError?: Error) {
    super(message)
    this.name = 'ProfileError'
  }
}

// ... any other existing exports ...

'use server'

import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { profileABI, accessABI } from '@/app/api/blockchain/abis'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import type { Profile, ProfileMetadata } from '../../profile'
import { revalidatePath } from 'next/cache'
import { getProfileSchema } from '../../validations/schemas'

// Role constants
const ROLES = {
  ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000',
  PROFILE_MANAGER: '0x2d46c56e9f7e96c2c1cfc78c45b65c1e93bb34de2c4ba58e7bc3896fd245e1d6',
} as const

interface ProfileManagementResponse {
  success: boolean
  error?: string
  data?: any
}

// Helper function to check if user has required role
async function hasRequiredRole(address: string, role: string): Promise<boolean> {
  try {
    const accessControlContract = await getServerContract({
      address: getContractAddress('ACCESS_CONTROL'),
      abi: accessControlABI,
    })
    const [isAdmin, hasRole] = await Promise.all([
      accessControlContract.hasRole(ROLES.ADMIN, address),
      accessControlContract.hasRole(role, address),
    ])
    return isAdmin || hasRole
  } catch (error) {
    console.error('Error checking role:', error)
    return false
  }
}

// Helper function to validate metadata
async function validateMetadata(metadata: ProfileMetadata): Promise<string | null> {
  try {
    const schema = getProfileSchema(metadata.tier)
    await schema.parseAsync(metadata)
    return null
  } catch (error) {
    if (error instanceof Error) {
      return error.message
    }
    return 'Invalid profile metadata'
  }
}

export async function createProfile(
  callerAddress: string,
  metadata: ProfileMetadata
): Promise<ProfileManagementResponse> {
  try {
    // Validate metadata first
    const validationError = await validateMetadata(metadata)
    if (validationError) {
      return {
        success: false,
        error: validationError,
      }
    }

    // Check if caller has profile manager role
    const canManageProfiles = await hasRequiredRole(callerAddress, ROLES.PROFILE_MANAGER)
    if (!canManageProfiles) {
      return {
        success: false,
        error: 'Caller does not have profile management permissions',
      }
    }

    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })
    const tx = await profileContract.createProfile(metadata)
    await tx.wait()

    // Revalidate profile pages
    revalidatePath('/[locale]/(authenticated)/profile')

    return {
      success: true,
      data: { hash: tx.hash },
    }
  } catch (error) {
    console.error('Error creating profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create profile',
    }
  }
}

export async function updateProfile(
  callerAddress: string,
  profileId: string,
  metadata: ProfileMetadata
): Promise<ProfileManagementResponse> {
  try {
    // Validate metadata first
    const validationError = await validateMetadata(metadata)
    if (validationError) {
      return {
        success: false,
        error: validationError,
      }
    }

    // Check if caller has profile manager role
    const canManageProfiles = await hasRequiredRole(callerAddress, ROLES.PROFILE_MANAGER)
    if (!canManageProfiles) {
      return {
        success: false,
        error: 'Caller does not have profile management permissions',
      }
    }

    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })
    const tx = await profileContract.updateProfile(profileId, metadata)
    await tx.wait()

    // Revalidate profile pages
    revalidatePath('/[locale]/(authenticated)/profile')

    return {
      success: true,
      data: { hash: tx.hash },
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    }
  }
}

export async function deleteProfile(
  callerAddress: string,
  profileId: string
): Promise<ProfileManagementResponse> {
  try {
    // Check if caller has admin role (only admins can delete profiles)
    const isAdmin = await hasRequiredRole(callerAddress, ROLES.ADMIN)
    if (!isAdmin) {
      return {
        success: false,
        error: 'Only admins can delete profiles',
      }
    }

    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })
    const tx = await profileContract.deleteProfile(profileId)
    await tx.wait()

    // Revalidate profile pages
    revalidatePath('/[locale]/(authenticated)/profile')

    return {
      success: true,
      data: { hash: tx.hash },
    }
  } catch (error) {
    console.error('Error deleting profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete profile',
    }
  }
}

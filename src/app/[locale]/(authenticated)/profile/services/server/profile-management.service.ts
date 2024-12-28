'use server'

import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { profileABI } from '@/app/api/blockchain/abis'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import type { ProfileMetadata } from '../../profile'
import { revalidatePath } from 'next/cache'
import { getProfileSchema } from '../../validations/validation'
import { ROLES } from '../../constants/roles'
import { hasRequiredRole } from '../../utils/role-utils'
import { decodeProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'

interface ProfileManagementResponse {
  success: boolean
  error?: string
  data?: any
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
    const validationError = await validateMetadata(metadata)
    if (validationError) {
      return { success: false, error: validationError }
    }

    const canManageProfiles = await hasRequiredRole(callerAddress, ROLES.PROFILE_MANAGER)
    if (!canManageProfiles) {
      return { success: false, error: 'Caller does not have profile management permissions' }
    }

    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })
    const tx = await profileContract.createProfile(metadata.metadataUri)
    await tx.wait()

    revalidatePath('/[locale]/(authenticated)/profile')

    return { success: true, data: { hash: tx.hash } }
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
    const validationError = await validateMetadata(metadata)
    if (validationError) {
      return { success: false, error: validationError }
    }

    const canManageProfiles = await hasRequiredRole(callerAddress, ROLES.PROFILE_MANAGER)
    if (!canManageProfiles) {
      return { success: false, error: 'Caller does not have profile management permissions' }
    }

    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })
    const tx = await profileContract.updateProfile(profileId, metadata.metadataUri)
    await tx.wait()

    revalidatePath('/[locale]/(authenticated)/profile')

    return { success: true, data: { hash: tx.hash } }
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
    const isAdmin = await hasRequiredRole(callerAddress, ROLES.ADMIN)
    if (!isAdmin) {
      return { success: false, error: 'Only admins can delete profiles' }
    }

    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })
    const tx = await profileContract.adminDeleteProfile(profileId)
    await tx.wait()

    revalidatePath('/[locale]/(authenticated)/profile')

    return { success: true, data: { hash: tx.hash } }
  } catch (error) {
    console.error('Error deleting profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete profile',
    }
  }
}

export async function fetchAndDecodeProfile(address: string) {
  try {
    const profileContract = await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })

    const logs = await profileContract.getPastEvents('ProfileCreated', {
      filter: { wallet: address },
      fromBlock: 0,
      toBlock: 'latest',
    })

    const decodedProfiles = logs.map((log) => decodeProfileEvent(log, profileABI))

    return decodedProfiles
  } catch (error) {
    console.error('Error fetching and decoding profile:', error)
    return null
  }
}

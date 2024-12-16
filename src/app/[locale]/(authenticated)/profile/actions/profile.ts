'use server'

import { getContract } from '@/lib/web3/client'
import { PROFILE_REGISTRY_ABI } from '@/lib/web3/abis'
import { PROFILE_REGISTRY_ADDRESS } from '@/lib/web3/addresses'
import { ipfsService } from '@/lib/services/ipfs-service'
import { validateProfile } from '@/lib/validations/profile'
import type {
  ProfileMetadata,
  FreeProfileMetadata,
  ProProfileMetadata,
  GroupProfileMetadata,
  ProfileTier,
} from '@/app/api/types/profile'
import { revalidatePath } from 'next/cache'

// Add type for contract methods
interface ProfileContract {
  mint: (
    address: string,
    tier: ProfileTier,
    ipfsHash: string
  ) => Promise<{ wait: () => Promise<{ tokenId: string }> }>
  getProfile: (address: string) => Promise<{
    exists: boolean
    tier: ProfileTier
    tokenId: string
    metadataURI: string
  }>
  updateProfile: (address: string, ipfsHash: string) => Promise<{ wait: () => Promise<void> }>
  upgradeTier: (address: string, newTier: ProfileTier) => Promise<{ wait: () => Promise<void> }>
}

export async function handleProfileCreate(
  metadata: ProfileMetadata,
  tier: ProfileTier,
  address: string
) {
  try {
    // Validate the profile data based on tier
    const validationResult = await validateProfile(metadata, tier)
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error,
      }
    }

    const contract = getContract(
      PROFILE_REGISTRY_ADDRESS,
      PROFILE_REGISTRY_ABI
    ) as unknown as ProfileContract

    // Upload metadata to IPFS
    const ipfsHash = await ipfsService.uploadMetadata(metadata)

    // Mint profile NFT with metadata
    const tx = await contract.mint(address, tier, ipfsHash)
    const receipt = await tx.wait()

    return {
      success: true,
      data: {
        tokenId: receipt.tokenId,
        tier,
        ipfsHash,
      },
    }
  } catch (error) {
    console.error('Error creating profile:', error)
    return {
      success: false,
      error: 'Failed to create profile NFT',
    }
  }
}

export async function handleProfileUpdate(metadata: ProfileMetadata, address: string) {
  try {
    const contract = getContract(
      PROFILE_REGISTRY_ADDRESS,
      PROFILE_REGISTRY_ABI
    ) as unknown as ProfileContract

    // Get current profile to determine tier
    const currentProfile = await contract.getProfile(address)

    // Validate the profile data based on current tier
    const validationResult = await validateProfile(metadata, currentProfile.tier)
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error,
      }
    }

    // Upload new metadata to IPFS
    const ipfsHash = await ipfsService.uploadMetadata(metadata)

    // Update profile metadata on-chain
    const tx = await contract.updateProfile(address, ipfsHash)
    await tx.wait()

    return {
      success: true,
      data: {
        ipfsHash,
        tier: currentProfile.tier,
      },
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      success: false,
      error: 'Failed to update profile metadata',
    }
  }
}

export async function handleProfileUpgrade(address: string, newTier: ProfileTier) {
  try {
    const contract = getContract(
      PROFILE_REGISTRY_ADDRESS,
      PROFILE_REGISTRY_ABI
    ) as unknown as ProfileContract

    // Verify upgrade eligibility
    const currentProfile = await contract.getProfile(address)
    if (!currentProfile.exists) {
      return {
        success: false,
        error: 'Profile does not exist',
      }
    }

    // Prevent downgrade
    if (currentProfile.tier >= newTier) {
      return {
        success: false,
        error: 'Cannot downgrade profile tier',
      }
    }

    // Perform upgrade
    const tx = await contract.upgradeTier(address, newTier)
    await tx.wait()

    return {
      success: true,
      data: {
        previousTier: currentProfile.tier,
        newTier,
      },
    }
  } catch (error) {
    console.error('Error upgrading profile:', error)
    return {
      success: false,
      error: 'Failed to upgrade profile tier',
    }
  }
}

export async function handleProfileGet(address: string) {
  try {
    const contract = getContract(
      PROFILE_REGISTRY_ADDRESS,
      PROFILE_REGISTRY_ABI
    ) as unknown as ProfileContract

    // Get profile data from chain
    const profileData = await contract.getProfile(address)

    if (!profileData.exists) {
      return {
        success: false,
        error: 'Profile not found',
      }
    }

    // Fetch metadata from IPFS
    const metadata = await ipfsService.getMetadata(profileData.metadataURI)

    return {
      success: true,
      data: {
        ...metadata,
        tier: profileData.tier,
        tokenId: profileData.tokenId,
        metadataURI: profileData.metadataURI,
      },
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return {
      success: false,
      error: 'Failed to fetch profile',
    }
  }
}

// Types for action responses
export type ProfileActionResponse<T = any> = Promise<{
  success: boolean
  data?: T
  error?: string
}>

export type ProfileCreateResponse = ProfileActionResponse<{
  tokenId: string
  tier: ProfileTier
  ipfsHash: string
}>

export type ProfileUpdateResponse = ProfileActionResponse<{
  ipfsHash: string
  tier: ProfileTier
}>

export type ProfileUpgradeResponse = ProfileActionResponse<{
  previousTier: ProfileTier
  newTier: ProfileTier
}>

export type ProfileGetResponse = ProfileActionResponse<
  ProfileMetadata & {
    tier: ProfileTier
    tokenId: string
    metadataURI: string
  }
>

export async function submitProfile(
  prevState: { message: string | null },
  formData: FormData
): Promise<{ message: string | null }> {
  try {
    // Extract form data
    const metadata = Object.fromEntries(formData.entries()) as ProfileMetadata
    const tier = formData.get('tier') as ProfileTier
    const address = formData.get('address') as string

    // Use existing handleProfileCreate
    const result = await handleProfileCreate(metadata, tier, address)

    if (!result.success) {
      return { message: result.error || 'Failed to create profile' }
    }

    // Revalidate profile pages
    revalidatePath('/profile')

    return {
      message: 'Profile created successfully',
    }
  } catch (error) {
    console.error('Profile submission error:', error)
    return {
      message: error instanceof Error ? error.message : 'Failed to create profile',
    }
  }
}

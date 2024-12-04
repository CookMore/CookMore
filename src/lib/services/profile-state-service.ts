import { ProfileMetadata, ProfileTier } from '@/types/profile'
import { ipfsService } from './ipfs-service'
import { validateOnChainMetadata } from '@/lib/validations/profile.chain'
import { validateProfileData } from '@/lib/validations/profile.validation'

class ProfileStateService {
  private draftKey = 'profile_draft'

  async prepareMinting(metadata: ProfileMetadata, tier: ProfileTier) {
    // First validate the on-chain metadata
    const onChainData = {
      name: metadata.name,
      bio: metadata.bio,
      avatar: metadata.avatar,
      ipfsNotesCID: '', // Will be set after IPFS upload
    }

    const onChainValidation = validateOnChainMetadata(onChainData)
    if (!onChainValidation.success) {
      return {
        isValid: false,
        error: 'Invalid on-chain metadata: ' + onChainValidation.error.message,
      }
    }

    // Then validate the complete profile data
    const validation = validateProfileData(metadata, tier)
    if (!validation.success) {
      return {
        isValid: false,
        error: 'Invalid profile data: ' + validation.error.message,
      }
    }

    try {
      // Upload complete metadata to IPFS
      const metadataUri = await ipfsService.uploadProfileMetadata(metadata, tier)

      // Update the on-chain data with the IPFS CID
      onChainData.ipfsNotesCID = metadataUri.replace('ipfs://', '')

      return {
        isValid: true,
        metadataUri,
        onChainData,
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to prepare metadata: ' + (error as Error).message,
      }
    }
  }

  async saveDraft(data: ProfileMetadata) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.draftKey, JSON.stringify(data))
    }
  }

  async getDraft(): Promise<ProfileMetadata | null> {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem(this.draftKey)
      return draft ? JSON.parse(draft) : null
    }
    return null
  }

  async clearDraft() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.draftKey)
    }
  }
}

export const profileStateService = new ProfileStateService()

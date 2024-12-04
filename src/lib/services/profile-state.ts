import { type ProfileMetadata, type ProfileTier } from '@/types/profile'
import { validateProfileData } from '@/lib/validations/profile.validation'
import { ipfsService } from './ipfs-service'

class ProfileStateService {
  private static STORAGE_KEY = 'profile_draft'

  async prepareMinting(
    metadata: ProfileMetadata,
    tier: ProfileTier
  ): Promise<{ metadataUri: string; isValid: boolean }> {
    // Validate
    const validation = validateProfileData(metadata, tier)
    if (!validation.success) {
      throw new Error(validation.error.message)
    }

    // Upload to IPFS
    const metadataUri = await ipfsService.uploadProfileMetadata(metadata, tier)

    return {
      metadataUri,
      isValid: true,
    }
  }

  saveDraft(metadata: Partial<ProfileMetadata>): void {
    localStorage.setItem(ProfileStateService.STORAGE_KEY, JSON.stringify(metadata))
  }

  getDraft(): Partial<ProfileMetadata> | null {
    const saved = localStorage.getItem(ProfileStateService.STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  }

  clearDraft(): void {
    localStorage.removeItem(ProfileStateService.STORAGE_KEY)
  }
}

export const profileStateService = new ProfileStateService()

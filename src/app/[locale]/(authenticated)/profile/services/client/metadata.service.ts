'use client'

import { ProfileTier } from '../../profile'
import type {
  ProfileMetadata,
  FreeProfileMetadata,
  ProProfileMetadata,
  GroupProfileMetadata,
} from '../../profile'
import { CURRENT_PROFILE_VERSION } from '../../profile'
import { getProfileSchema } from '../../validations/validation'
import { ipfsService } from '../ipfs/ipfs.service'
import { MetadataTransformer } from '../transformers/metadata.transformer'
import html2canvas from 'html2canvas'
import { contractService } from './contract.service'
import type { MintStatus } from './contract.service'
import { NFTMetadata } from '../../types/metadata'
import { OGExtension } from '../../types/metadata'

export type GenerationProgress = {
  stage: 'preparing' | 'loading-images' | 'capturing' | 'processing' | 'complete'
  progress: number
  message: string
}

export class ProfileMetadataService {
  private progressCallback?: (progress: GenerationProgress) => void
  private mintStatusCallback?: (status: MintStatus) => void

  setProgressCallback(callback: (progress: GenerationProgress) => void) {
    this.progressCallback = callback
  }

  setMintStatusCallback(callback: (status: MintStatus) => void) {
    this.mintStatusCallback = callback
    contractService.setStatusCallback(callback)
  }

  private updateProgress(stage: GenerationProgress['stage'], progress: number, message: string) {
    if (this.progressCallback) {
      this.progressCallback({ stage, progress, message })
    }
    console.log(`Preview Generation Progress - ${stage}:`, { progress, message })
  }

  // Validate metadata against schema
  async validateMetadata(metadata: ProfileMetadata): Promise<string | null> {
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

  // Create empty metadata for a tier
  createEmptyMetadata(tier: ProfileTier): ProfileMetadata {
    // Base metadata fields for all tiers
    const baseMetadata = {
      version: CURRENT_PROFILE_VERSION,
      tier,
      basicInfo: {
        name: '',
        bio: '',
        avatar: '',
        location: '',
        social: { twitter: '', website: '' },
      },
      social: { urls: [], labels: [] },
      preferences: {
        theme: 'system' as const,
        notifications: true,
        displayEmail: false,
        displayLocation: false,
      },
      culinaryInfo: {
        expertise: 'beginner' as const,
        specialties: [],
        dietaryPreferences: [],
        cuisineTypes: [],
        techniques: [],
        equipment: [],
        certifications: [],
      },
      achievements: {
        recipesCreated: 0,
        recipesForked: 0,
        totalLikes: 0,
        badges: [],
      },
    }

    if (tier === ProfileTier.FREE) {
      return baseMetadata as FreeProfileMetadata
    }

    if (tier === ProfileTier.PRO) {
      return {
        ...baseMetadata,
        experience: {
          current: {
            title: '',
            company: '',
            startDate: '',
          },
          history: [],
        },
        education: [],
        culinaryInfo: {
          ...baseMetadata.culinaryInfo,
          certifications: [],
        },
      } as ProProfileMetadata
    }

    const groupBaseMetadata = {
      ...baseMetadata,
      baseName: '',
      experience: {
        current: {
          title: '',
          company: '',
          startDate: '',
        },
        history: [],
      },
      organizationInfo: {
        type: 'restaurant' as const,
        establishedYear: new Date().getFullYear().toString(),
        size: 'small' as const,
        team: [],
      },
      compliance: {
        certifications: [],
        licenses: [],
      },
      businessOperations: {
        operatingHours: [],
        serviceTypes: [],
        specializations: [],
        capacity: {
          seating: undefined,
          eventSpace: undefined,
          trainingCapacity: undefined,
          maxOccupancy: undefined,
        },
      },
      culinaryInfo: {
        expertise: 'beginner' as const,
        specialties: [],
        dietaryPreferences: [],
        cuisineTypes: [],
        techniques: [],
        equipment: [],
        certifications: [],
      },
    }

    if (tier === ProfileTier.GROUP) {
      return groupBaseMetadata as GroupProfileMetadata
    }

    if (tier === ProfileTier.OG) {
      return {
        ...groupBaseMetadata,
        ogBenefits: {
          joinDate: new Date().toISOString(),
          memberNumber: 0,
          customBranding: {
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
          },
          apiAccess: {
            enabled: false,
          },
        },
        showcase: {
          featured: false,
          highlights: [],
          specialAccess: [],
        },
        network: {
          mentorship: {
            available: false,
            specialties: [],
          },
          collaborations: [],
          events: [],
        },
        verificationStatus: {
          verified: false,
          verificationLevel: 'basic',
        },
      } as GroupProfileMetadata & OGExtension
    }

    return baseMetadata as FreeProfileMetadata
  }

  // Merge metadata updates with type checking
  mergeMetadata(existing: ProfileMetadata, updates: Partial<ProfileMetadata>): ProfileMetadata {
    const merged = { ...existing, ...updates }

    if (updates.tier === ProfileTier.PRO && 'experience' in existing) {
      const proMetadata = merged as ProProfileMetadata
      proMetadata.experience = {
        ...proMetadata.experience,
        ...(updates as Partial<ProProfileMetadata>).experience,
      }
    }

    if (updates.tier === ProfileTier.GROUP && 'organizationInfo' in existing) {
      const groupMetadata = merged as GroupProfileMetadata
      groupMetadata.organizationInfo = {
        ...groupMetadata.organizationInfo,
        ...(updates as Partial<GroupProfileMetadata>).organizationInfo,
      }
      groupMetadata.compliance = {
        ...groupMetadata.compliance,
        ...(updates as Partial<GroupProfileMetadata>).compliance,
      }
    }

    return merged
  }

  // Extract public metadata with type checking
  getPublicMetadata(metadata: ProfileMetadata): Partial<ProfileMetadata> {
    const { tier } = metadata
    const publicData: Partial<ProfileMetadata> = {
      tier,
      basicInfo: metadata.basicInfo,
    }

    if (tier === ProfileTier.PRO) {
      const proMetadata = metadata as ProProfileMetadata
      publicData.experience = {
        current: proMetadata.experience.current,
        history: proMetadata.experience.history,
      }
    } else if (tier === ProfileTier.GROUP) {
      const groupMetadata = metadata as GroupProfileMetadata
      publicData.organizationInfo = {
        type: groupMetadata.organizationInfo.type,
        establishedYear: groupMetadata.organizationInfo.establishedYear,
        size: groupMetadata.organizationInfo.size,
      }
    }

    return publicData
  }

  async generateNFTMetadata(nftMetadata: NFTMetadata, staticImage: File): Promise<string> {
    try {
      // 1. Upload static image
      const { cid: staticImageCID } = await ipfsService.uploadFile(staticImage)

      // Log the metadata to be uploaded
      console.log('NFT Metadata:', nftMetadata)

      // 3. Upload NFT metadata
      const metadataBlob = new Blob([JSON.stringify(nftMetadata)], { type: 'application/json' })
      const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' })

      // Log the file details
      console.log('Metadata File:', metadataFile)

      const { cid: metadataCID } = await ipfsService.uploadFile(metadataFile)

      return metadataCID
    } catch (error) {
      console.error('Error generating NFT metadata:', error)
      throw error
    }
  }

  async mintProfile(profileData: ProfileMetadata): Promise<{ success: boolean; tokenId?: string }> {
    try {
      // 1. Generate static preview
      const staticPreview = await this.generateStaticPreview(profileData)

      // 2. Generate and upload NFT metadata
      const metadataCID = await this.generateNFTMetadata(profileData, staticPreview)

      // 3. Mint the profile using the metadata CID
      const tokenId = await this.mintWithMetadata(metadataCID)

      return { success: true, tokenId }
    } catch (error) {
      console.error('Error minting profile:', error)
      return { success: false }
    }
  }

  async generateStaticPreview(formData: Partial<GroupProfileMetadata>): Promise<File> {
    const maxAttempts = 10
    const attemptInterval = 500 // 500ms between attempts

    // Example usage of formData
    console.log('Generating preview for:', formData)

    // Wait for the card content element to be ready
    const waitForCardElement = async () => {
      for (let i = 0; i < maxAttempts; i++) {
        const cardElement = document.getElementById('profile-card-content')
        if (cardElement?.dataset.ready === 'true') {
          // Add extra time for content to render
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return cardElement
        }
        await new Promise((resolve) => setTimeout(resolve, attemptInterval))
        console.log(`Waiting for card content element... Attempt ${i + 1}/${maxAttempts}`)
      }
      return null
    }

    // Set up progress tracking
    this.updateProgress('preparing', 0, 'Preparing badge preview...')

    // Wait for element
    const cardElement = await waitForCardElement()
    if (!cardElement) {
      throw new Error(
        'Profile card content element not found or not ready. Please ensure the preview is open.'
      )
    }

    try {
      // Update progress
      this.updateProgress('capturing', 30, 'Capturing badge...')

      // Use html2canvas with a delay to ensure content is rendered
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      })

      // Update progress
      this.updateProgress('processing', 60, 'Processing badge image...')

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!)
        }, 'image/png')
      })

      // Create file from blob
      const file = new File(
        [blob],
        `${(formData as any).basicInfo.name.replace(/\s+/g, '_')}_badge.png`,
        { type: 'image/png' }
      )

      // Complete progress
      this.updateProgress('complete', 100, 'Badge generated successfully')

      return file
    } catch (error) {
      console.error('Error generating badge:', error)
      throw new Error('Failed to generate badge image')
    }
  }

  private async mintWithMetadata(metadataCID: string): Promise<string> {
    const result = await contractService.mintProfile(metadataCID)
    if (!result.success || !result.tokenId) {
      throw new Error('Failed to mint profile NFT')
    }
    return result.tokenId
  }
}

// Export singleton instance
export const profileMetadataService = new ProfileMetadataService()

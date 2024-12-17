import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

export type TierActionType = 'MINT' | 'UPGRADE' | 'GIFT'

export interface TierPricing {
  basePrice: number
  discountedPrice?: number
  currency: 'USDC'
}

export interface TierAction {
  type: TierActionType
  from?: ProfileTier
  to: ProfileTier
  pricing: TierPricing
}

export interface TierActionButtonProps {
  currentTier: ProfileTier | null
  targetTier: ProfileTier
  onMintSuccess?: () => void
  className?: string
}

export interface TierPricingDisplayProps {
  currentTier: ProfileTier | null
  targetTier: ProfileTier
  className?: string
}

export interface GiftTierModalProps {
  isOpen: boolean
  onClose: () => void
  targetTier: ProfileTier
  onGiftSuccess?: () => void
}

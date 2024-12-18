'use client'

import { cn } from '@/app/api/utils/utils'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { TierPricingDisplayProps } from '../types/tier-actions'
import { inter } from '@/app/api/fonts'

export function TierPricing({ currentTier, targetTier, className }: TierPricingDisplayProps) {
  const getPrice = () => {
    if (targetTier === ProfileTier.FREE) return '$0'
    if (targetTier === ProfileTier.PRO) return '$25 USDC'
    if (targetTier === ProfileTier.OG) {
      if (currentTier === ProfileTier.GROUP) {
        return (
          <div className='flex flex-col'>
            <span className='text-3xl font-bold text-github-fg-default'>$50 USDC</span>
            <span className='text-sm text-github-success-fg'>$100 discount applied</span>
          </div>
        )
      }
      if (currentTier === ProfileTier.PRO) {
        return (
          <div className='flex flex-col'>
            <span className='text-3xl font-bold text-github-fg-default'>$125 USDC</span>
            <span className='text-sm text-github-success-fg'>$25 discount applied</span>
          </div>
        )
      }
      return '$150 USDC'
    }

    // Group tier pricing
    if (currentTier === ProfileTier.PRO) {
      return (
        <div className='flex flex-col'>
          <span className='text-3xl font-bold text-github-fg-default'>$75 USDC</span>
          <span className='text-sm text-github-success-fg'>$25 discount applied</span>
        </div>
      )
    }
    return '$100 USDC'
  }

  return (
    <div className={cn('mt-6', className)}>
      <p className={cn('text-3xl font-bold text-github-fg-default', inter.className)}>
        {getPrice()}
      </p>
      {targetTier !== ProfileTier.FREE && (
        <p className={cn('mt-1 text-sm text-github-fg-muted', inter.className)}>One-time payment</p>
      )}
    </div>
  )
}

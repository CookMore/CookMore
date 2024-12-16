'use client'

import { cn } from '@/app/api/utils/utils'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { TierMintDapp } from '@/app/[locale]/(authenticated)/tier/dapp/TierMintDapp'
import { IconCheck } from '@/app/api/icons'
import { tierInfo, isPaidTier, tierStyles } from '@/app/api/tiers/tiers'

interface TierCardProps {
  tier: ProfileTier
  currentTier: ProfileTier | null
  onMintSuccess?: () => void
}

export function TierCard({ tier, currentTier, onMintSuccess }: TierCardProps) {
  const info = tierInfo[tier]
  const style = tierStyles[tier]
  const Icon = style.icon

  const isCurrentTier = currentTier === tier
  const canUpgrade = currentTier !== ProfileTier.GROUP && tier > (currentTier || ProfileTier.FREE)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border transition-all',
        style.borderColor,
        style.bgColor,
        isCurrentTier && 'ring-2 ring-github-accent-emphasis ring-offset-2',
        canUpgrade && 'hover:border-github-accent-emphasis'
      )}
    >
      {/* Card Header */}
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={cn('flex h-10 w-10 items-center justify-center rounded-lg', style.iconBg)}
            >
              <Icon className={cn('h-6 w-6', style.color)} />
            </div>
            <div>
              <h3 className={cn('text-lg font-semibold', style.color)}>{info.title}</h3>
              <p className='text-sm text-github-fg-muted'>{info.description}</p>
            </div>
          </div>
          {isCurrentTier && (
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium text-white',
                style.badgeColor
              )}
            >
              Current
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className='mt-6'>
          <p className='text-3xl font-bold text-github-fg-default'>{info.price}</p>
          {isPaidTier(tier) && (
            <p className='mt-1 text-sm text-github-fg-muted'>One-time payment</p>
          )}
        </div>

        {/* Features */}
        <div className='mt-6 space-y-4'>
          <h4 className='text-sm font-medium text-github-fg-default'>Features</h4>
          <ul className='space-y-3'>
            {info.features.map((feature) => (
              <li key={feature} className='flex items-start gap-3'>
                <IconCheck className={cn('mt-1 h-4 w-4', style.color)} />
                <span className='text-sm text-github-fg-muted'>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations for Free Tier */}
        {'limitations' in info && (
          <div className='mt-6 space-y-4'>
            <h4 className='text-sm font-medium text-github-danger-fg'>Limitations</h4>
            <ul className='space-y-3'>
              {info.limitations.map((limitation) => (
                <li key={limitation} className='flex items-start gap-3'>
                  <span className='mt-2 h-1.5 w-1.5 rounded-full bg-github-danger-emphasis' />
                  <span className='text-sm text-github-danger-fg/70'>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Minting Section */}
      {isPaidTier(tier) && canUpgrade && (
        <div className='border-t border-github-border-default bg-github-canvas-default p-6'>
          <TierMintDapp targetTier={tier} currentTier={currentTier} onMintSuccess={onMintSuccess} />
        </div>
      )}
    </div>
  )
}

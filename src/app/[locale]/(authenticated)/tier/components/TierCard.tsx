'use client'

import { cn } from '@/app/api/utils/utils'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { TierMintDapp } from '@/app/[locale]/(authenticated)/tier/components/TierMintDapp'
import { IconCheck } from '@/app/api/icons'
import { tierInfo, tierStyles } from '@/app/api/tiers/tiers'
import { inter } from '@/app/api/fonts'

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

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border transition-all',
        'w-full lg:min-w-[380px]',
        style.borderColor,
        style.bgColor,
        isCurrentTier && 'ring-2 ring-github-accent-emphasis ring-offset-2'
      )}
    >
      {/* Card Header */}
      <div className='p-6 sm:p-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={cn('flex h-10 w-10 items-center justify-center rounded-lg', style.iconBg)}
            >
              <Icon className={cn('h-6 w-6', style.color)} />
            </div>
            <div>
              <h3 className={cn('text-lg font-semibold', style.color, inter.className)}>
                {info.title}
              </h3>
              <p className={cn('text-sm text-github-fg-muted', inter.className)}>
                {info.description}
              </p>
            </div>
          </div>
          {isCurrentTier && (
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium text-white',
                style.badgeColor,
                inter.className
              )}
            >
              Current
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className='mt-6'>
          <p className={cn('text-3xl font-bold text-github-fg-default', inter.className)}>
            {info.price}
          </p>
          {tier !== ProfileTier.FREE && (
            <p className={cn('mt-1 text-sm text-github-fg-muted', inter.className)}>
              One-time payment
            </p>
          )}
        </div>

        {/* Features */}
        <div className='mt-6 space-y-4'>
          <h4 className={cn('text-sm font-medium text-github-fg-default', inter.className)}>
            Features
          </h4>
          <ul className='space-y-3'>
            {info.features.map((feature) => (
              <li key={feature} className='flex items-start gap-3'>
                <IconCheck className={cn('mt-1 h-4 w-4', style.color)} />
                <span className={cn('text-sm text-github-fg-muted', inter.className)}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations for Free Tier */}
        {'limitations' in info && (
          <div className='mt-6 space-y-4'>
            <h4 className={cn('text-sm font-medium text-github-danger-fg', inter.className)}>
              Limitations
            </h4>
            <ul className='space-y-3'>
              {info.limitations.map((limitation) => (
                <li key={limitation} className='flex items-start gap-3'>
                  <span className='mt-2 h-1.5 w-1.5 rounded-full bg-github-danger-emphasis' />
                  <span className={cn('text-sm text-github-danger-fg/70', inter.className)}>
                    {limitation}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Minting Section - Always show for paid tiers */}
      {tier !== ProfileTier.FREE && (
        <div className='border-t border-github-border-default bg-github-canvas-default p-6'>
          <TierMintDapp targetTier={tier} currentTier={currentTier} onMintSuccess={onMintSuccess} />
        </div>
      )}
    </div>
  )
}

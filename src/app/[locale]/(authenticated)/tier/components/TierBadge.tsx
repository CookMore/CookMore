'use client'

import { cn } from '@/app/api/utils/utils'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { Tooltip } from '@/app/api/tooltip/tooltip'
import { useMediaQuery } from '@/app/api/hooks/useMediaQuery'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { tierInfo, tierStyles } from '@/app/api/tiers/tiers'
import Image from 'next/image'

interface TierBadgeProps {
  tier: ProfileTier
  size?: 'sm' | 'md' | 'lg'
  hasProfile?: boolean
  className?: string
}

export function TierBadge({
  tier,
  size = 'md',
  hasProfile = false,
  className = '',
}: TierBadgeProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 640px)')
  const info = tierInfo[tier]
  const style = tierStyles[tier]

  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  const dim = dimensions[size]

  const handleClick = () => {
    if (!hasProfile) {
      if (isMobile) {
        toast.error('Profile Required', {
          description: `Complete your profile to access tier features`,
        })
      }
      return
    }
    router.push('/tier')
  }

  const tooltipContent = (
    <div className='max-w-xs'>
      <p className='font-medium mb-1'>{info.title} Tier</p>
      <p className='text-sm text-github-fg-muted'>
        {tier === ProfileTier.FREE
          ? 'Upgrade to Pro, Group, or OG tier to unlock premium features.'
          : tier === ProfileTier.GROUP
            ? 'Group features are available for this profile.'
            : tier === ProfileTier.OG
              ? 'OG features are available for this profile. Limited edition membership.'
              : 'Pro features are available for this profile.'}
        {!hasProfile && ' Complete your profile to access tier settings.'}
      </p>
    </div>
  )

  return (
    <Tooltip content={tooltipContent}>
      <button
        onClick={handleClick}
        className={cn(
          'relative flex items-center gap-2',
          hasProfile ? 'hover:opacity-90' : '',
          'transition-opacity',
          className
        )}
      >
        <div className={cn('relative', `w-${dim} h-${dim}`)}>
          <Image
            src={
              tier === ProfileTier.FREE
                ? 'https://ipfs.io/ipfs/bafkreieeswhm4qgx2x3i7hw2jbmnrt7zkgogdk676kk25tkbr5wisyv5za'
                : tier === ProfileTier.PRO
                  ? 'https://ipfs.io/ipfs/QmQnkRY6b2ckAbYQtn7btBWw3p2LcL2tZReFxViJ3aayk3'
                  : tier === ProfileTier.GROUP
                    ? 'https://ipfs.io/ipfs/QmRNqHVG9VHBafsd9ypQt82rZwVMd14Qt2DWXiK5dptJRs'
                    : 'https://ipfs.io/ipfs/QmXYZ...' // OG badge
            }
            alt={`${info.title} NFT Badge`}
            width={dim}
            height={dim}
            className={cn('rounded-md', style.bgColor)}
            priority
            unoptimized
          />
        </div>
        <span className={cn('text-sm font-medium', style.color)}>{info.title}</span>
      </button>
    </Tooltip>
  )
}

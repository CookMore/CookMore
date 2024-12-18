'use client'

import Image from 'next/image'
import { Tooltip } from '@/app/api/tooltip/tooltip'
import { useMediaQuery } from '@/app/api/hooks/useMediaQuery'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

const LITE_IMAGE_URL =
  'https://ipfs.io/ipfs/bafkreieeswhm4qgx2x3i7hw2jbmnrt7zkgogdk676kk25tkbr5wisyv5za'
const PRO_IMAGE_URL = 'https://ipfs.io/ipfs/QmQnkRY6b2ckAbYQtn7btBWw3p2LcL2tZReFxViJ3aayk3'
const GROUP_IMAGE_URL = 'https://ipfs.io/ipfs/QmRNqHVG9VHBafsd9ypQt82rZwVMd14Qt2DWXiK5dptJRs'
const OG_IMAGE_URL = 'https://ipfs.io/ipfs/QmXYZ...' // Replace with actual OG badge IPFS URL

interface TierBadgeProps {
  tier: ProfileTier
  size?: 'sm' | 'md' | 'lg'
  hasProfile?: boolean
  className?: string
}

const getTierDisplayName = (tier: ProfileTier) => {
  switch (tier) {
    case ProfileTier.FREE:
      return 'Lite'
    case ProfileTier.PRO:
      return 'Pro'
    case ProfileTier.GROUP:
      return 'Group'
    case ProfileTier.OG:
      return 'OG'
    default:
      return tier
  }
}

export function TierBadge({
  tier,
  size = 'md',
  hasProfile = false,
  className = '',
}: TierBadgeProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 640px)')
  const displayName = getTierDisplayName(tier)

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
      <p className='font-medium mb-1'>{displayName} Tier</p>
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
        className={`relative ${hasProfile ? 'hover:opacity-90' : ''} transition-opacity ${className}`}
      >
        <div className={`w-${dim / 4} h-${dim / 4} relative`}>
          <Image
            src={
              tier === ProfileTier.FREE
                ? LITE_IMAGE_URL
                : tier === ProfileTier.PRO
                  ? PRO_IMAGE_URL
                  : tier === ProfileTier.GROUP
                    ? GROUP_IMAGE_URL
                    : OG_IMAGE_URL
            }
            alt={`${displayName} NFT`}
            width={dim}
            height={dim}
            className='rounded-md'
            priority
            unoptimized
          />
        </div>
      </button>
    </Tooltip>
  )
}

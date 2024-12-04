import Image from 'next/image'
import { Tooltip } from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ProfileTier } from '@/types/profile'

const PRO_IMAGE_URL = 'https://ipfs.io/ipfs/QmQnkRY6b2ckAbYQtn7btBWw3p2LcL2tZReFxViJ3aayk3'
const GROUP_IMAGE_URL = 'https://ipfs.io/ipfs/QmRNqHVG9VHBafsd9ypQt82rZwVMd14Qt2DWXiK5dptJRs'

interface TierBadgeProps {
  tier: ProfileTier
  size?: 'sm' | 'md' | 'lg'
  hasProfile?: boolean
}

export function TierBadge({ tier, size = 'md', hasProfile = false }: TierBadgeProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 640px)')

  if (tier === ProfileTier.FREE) return null

  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  const dim = dimensions[size]

  const handleClick = () => {
    if (!hasProfile) {
      if (isMobile) {
        toast.info(`Complete your profile to access ${tier} tier features`, {
          duration: 3000,
        })
      }
      return
    }
    router.push('/settings/tier')
  }

  const tooltipContent = (
    <div className='max-w-xs'>
      <p className='font-medium mb-1'>{tier} Tier Features</p>
      <p className='text-sm text-github-fg-muted'>
        {tier === ProfileTier.GROUP ? 'Group features' : 'Pro features'} are available for this
        profile.
        {!hasProfile && ' Complete your profile to access tier settings.'}
      </p>
    </div>
  )

  return (
    <Tooltip content={tooltipContent}>
      <button
        onClick={handleClick}
        className={`relative ${hasProfile ? 'hover:opacity-90' : ''} transition-opacity`}
      >
        <div className={`w-${dim / 4} h-${dim / 4} relative`}>
          <Image
            src={tier === ProfileTier.PRO ? PRO_IMAGE_URL : GROUP_IMAGE_URL}
            alt={`${tier} NFT`}
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

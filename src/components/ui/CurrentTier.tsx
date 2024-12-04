'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useAccount, useReadContract } from 'wagmi'
import { motion } from 'framer-motion'
import { IconChefHat, IconBuilding, IconStar, IconCheck } from '@/components/ui/icons'
import { ProfileTier } from '@/types/profile'
import { TierMintDapp } from '@/components/dapps/tier/TierMintDapp'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useProfile } from '@/hooks/useProfile'
import { usePathname } from 'next/navigation'

// Contract addresses
const PRO_CONTRACT = '0xa859Ca4cF5Fc201E710C1A8Dc8540beaa9878C02'
const GROUP_CONTRACT = '0x6c927C8F1661460c5f3adDcd26d7698910077492'

// Simplified ABI for balance checking
const NFT_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const tierInfo = {
  [ProfileTier.FREE]: {
    icon: IconChefHat,
    color: 'text-github-fg-default',
    bgColor: 'bg-github-canvas-subtle',
    borderColor: 'border-github-border-default',
    description: 'Start your culinary journey with basic features',
    features: [
      'Create and share public recipes',
      'Basic recipe versioning',
      'Community interaction',
      'Standard support',
    ],
    limitations: [
      '$1 platform fee per Recipe NFT',
      'Limited collaboration features',
      'Basic profile customization',
    ],
    price: 'Free',
  },
  [ProfileTier.PRO]: {
    icon: IconStar,
    color: 'text-github-success-fg',
    bgColor: 'bg-github-success-subtle',
    borderColor: 'border-github-success-emphasis',
    description: 'Unlock premium features and advanced tools',
    features: [
      'No platform fees',
      'Advanced recipe management',
      'Premium collaboration tools',
      'Priority support',
    ],
    benefits: [
      'Lifetime access to Pro features',
      'Early access to new features',
      'Enhanced profile customization',
    ],
    price: '25 USDC',
  },
  [ProfileTier.GROUP]: {
    icon: IconBuilding,
    color: 'text-github-sponsors-fg',
    bgColor: 'bg-github-sponsors-subtle',
    borderColor: 'border-github-sponsors-emphasis',
    description: 'Unlock advanced collaborative features',
    features: [
      'Everything in Pro',
      'Collaborative recipe editing',
      'Advanced version control',
      'Priority support',
    ],
    benefits: [
      'Access to Group member network',
      'Advanced collaboration tools',
      'Cross-kitchen recipe sharing',
    ],
    price: '100 USDC',
  },
} as const

const tierStyles = {
  [ProfileTier.FREE]: {
    icon: IconChefHat,
    color: 'text-github-fg-default',
    bgColor: 'bg-github-canvas-subtle',
    borderColor: 'border-github-border-default',
    hoverBorder: 'hover:border-github-border-muted',
    badgeColor: 'bg-github-fg-muted',
    iconBg: 'bg-github-canvas-subtle',
  },
  [ProfileTier.PRO]: {
    icon: IconStar,
    color: 'text-github-accent-fg',
    bgColor: 'bg-github-accent-subtle',
    borderColor: 'border-github-accent-emphasis',
    hoverBorder: 'hover:border-github-accent-muted',
    badgeColor: 'bg-github-accent-emphasis',
    iconBg: 'bg-github-accent-muted',
  },
  [ProfileTier.GROUP]: {
    icon: IconBuilding,
    color: 'text-github-success-fg',
    bgColor: 'bg-github-success-subtle',
    borderColor: 'border-github-success-emphasis',
    hoverBorder: 'hover:border-github-success-muted',
    badgeColor: 'bg-github-success-emphasis',
    iconBg: 'bg-github-success-muted',
  },
} as const

function CurrentTierWrapper() {
  const pathname = usePathname()
  const { profile, isLoading: profileLoading } = useProfile()
  const { ready } = usePrivy()

  // Don't render during profile creation or loading
  if (!ready || pathname === '/profile/create' || profileLoading) {
    return (
      <div className='flex justify-center items-center space-x-4'>
        <div className='animate-pulse w-[320px] h-[520px] bg-github-canvas-subtle rounded-lg' />
        <div className='animate-pulse w-[320px] h-[520px] bg-github-canvas-subtle rounded-lg' />
        <div className='animate-pulse w-[320px] h-[520px] bg-github-canvas-subtle rounded-lg' />
      </div>
    )
  }

  return <CurrentTier />
}

function CurrentTier() {
  const [currentTier, setCurrentTier] = useState<ProfileTier>(ProfileTier.FREE)
  const { authenticated, ready } = usePrivy()
  const { address, isConnected } = useAccount()

  const { data: proBalance } = useReadContract({
    address: PRO_CONTRACT as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && ready && authenticated,
      staleTime: Infinity,
      cacheTime: 0,
      retry: false,
    },
  })

  const { data: groupBalance } = useReadContract({
    address: GROUP_CONTRACT as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && ready && authenticated,
      staleTime: Infinity,
      cacheTime: 0,
      retry: false,
    },
  })

  useEffect(() => {
    if (!authenticated || !ready || !isConnected) {
      setCurrentTier(ProfileTier.FREE)
      return
    }

    if (groupBalance && typeof groupBalance === 'bigint' && groupBalance > BigInt(0)) {
      setCurrentTier(ProfileTier.GROUP)
    } else if (proBalance && typeof proBalance === 'bigint' && proBalance > BigInt(0)) {
      setCurrentTier(ProfileTier.PRO)
    } else {
      setCurrentTier(ProfileTier.FREE)
    }
  }, [authenticated, ready, isConnected, proBalance, groupBalance])

  const renderTierCard = (tier: ProfileTier) => {
    const info = tierInfo[tier]
    const style = tierStyles[tier]
    const Icon = style.icon
    const isCurrentTier = currentTier === tier

    return (
      <div
        className={cn(
          'relative rounded-lg border transition-all duration-200 min-h-[520px] w-[320px]',
          'hover:shadow-lg hover:translate-y-[-2px]',
          isCurrentTier
            ? `${style.borderColor} ${style.bgColor}`
            : `border-github-border-default ${style.hoverBorder}`
        )}
      >
        {isCurrentTier && (
          <div
            className={cn(
              'absolute -top-3 left-4 px-3 py-1',
              'text-xs font-medium rounded-full text-white',
              style.badgeColor
            )}
          >
            Current Tier
          </div>
        )}

        <div className='p-6 space-y-6'>
          {/* Header Section */}
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg',
                  style.iconBg,
                  style.color
                )}
              >
                <Icon className='w-6 h-6' />
              </div>
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-github-fg-default'>{tier} Tier</h2>
              </div>
            </div>

            <p className='text-github-fg-muted text-sm leading-relaxed'>{info.description}</p>

            {tier !== ProfileTier.FREE && (
              <div className='space-y-2'>
                <div
                  className={cn(
                    'flex items-center justify-center py-3 px-4 rounded-lg',
                    'bg-github-canvas-subtle border border-github-border-default'
                  )}
                >
                  <div className='text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <span className='text-3xl font-bold text-github-fg-default'>
                        {info.price}
                      </span>
                      <span className='text-sm text-github-fg-muted bg-github-canvas-default px-2 py-1 rounded'>
                        one-time
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-center gap-2 text-sm text-github-fg-muted'>
                  <Link
                    href='https://www.base.org'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2 hover:text-github-fg-default transition-colors'
                  >
                    <Image
                      src='/icons/brand/base-logo-in-blue.svg'
                      alt='Base Network'
                      width={16}
                      height={16}
                      className='rounded-full'
                    />
                    <span>On Base Network</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div>
            <h3 className='text-sm font-medium text-github-fg-default mb-3'>Features</h3>
            <ul className='space-y-2'>
              {info.features.map((feature) => (
                <li key={feature} className='flex items-center text-sm text-github-fg-muted'>
                  <IconCheck className={cn('w-4 h-4 mr-2', style.color)} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits Section */}
          {tier !== ProfileTier.FREE && info.benefits && (
            <div>
              <h3 className={cn('text-sm font-medium mb-3', style.color)}>Benefits</h3>
              <ul className='space-y-2'>
                {info.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className={cn('flex items-center text-sm', style.color + '/70')}
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full mr-3', style.badgeColor)} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Limitations Section */}
          {tier === ProfileTier.FREE && info.limitations && (
            <div>
              <h3 className='text-sm font-medium text-github-danger-fg mb-3'>Limitations</h3>
              <ul className='space-y-2'>
                {info.limitations.map((limitation) => (
                  <li
                    key={limitation}
                    className='flex items-center text-sm text-github-danger-fg/70'
                  >
                    <span className='w-1.5 h-1.5 rounded-full mr-3 bg-github-danger-emphasis' />
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Minting Section */}
          {tier !== ProfileTier.FREE && (
            <div className='border-t border-github-border-default pt-6'>
              <TierMintDapp targetTier={tier} onMintSuccess={() => {}} currentTier={currentTier} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {[ProfileTier.FREE, ProfileTier.PRO, ProfileTier.GROUP].map((tier) => (
        <motion.div
          key={tier}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1 * Object.values(ProfileTier).indexOf(tier),
          }}
          className='flex justify-center'
        >
          {renderTierCard(tier)}
        </motion.div>
      ))}
    </>
  )
}

export default CurrentTierWrapper

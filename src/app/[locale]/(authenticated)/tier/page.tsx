'use client'

import { useNFTTiers } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { TierCard } from './components/TierCard'
import { IconStar } from '@/app/api/icons'
import { useAdminCheck } from '@/app/api/auth/hooks/useAdminCheck'
import { BasePageLayout } from '@/app/api/layouts/BasePageLayout'
import { FullPageLayout } from '@/app/api/layouts/FullPage'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

function LoadingTiers() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 xl:gap-12 place-items-stretch'>
      {[...Array(3)].map((_, i) => (
        <div key={i} className='flex justify-center'>
          <div className='animate-pulse w-full lg:min-w-[380px] h-[32.5rem] bg-github-canvas-subtle rounded-lg' />
        </div>
      ))}
    </div>
  )
}

export default function TierPage() {
  const [mounted, setMounted] = useState(false)
  const { hasGroup, hasPro, isLoading, refetch } = useNFTTiers()
  const { isAdmin } = useAdminCheck()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMintSuccess = () => {
    refetch()
  }

  if (!isAdmin) {
    return null
  }

  if (!mounted || isLoading) {
    return (
      <BasePageLayout>
        <FullPageLayout fullWidth>
          <div className='w-full px-4 sm:px-6 lg:px-8'>
            <LoadingTiers />
          </div>
        </FullPageLayout>
      </BasePageLayout>
    )
  }

  const tiers = [ProfileTier.FREE, ProfileTier.PRO, ProfileTier.GROUP]

  return (
    <BasePageLayout>
      <FullPageLayout fullWidth>
        <div className='w-full'>
          {/* Header */}
          <div className='px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 text-center'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='mb-4 flex items-center justify-center gap-2 text-github-accent-fg'
            >
              <IconStar className='h-6 w-6' />
              <h1 className='text-3xl sm:text-4xl font-bold text-github-fg-default'>
                Membership Tiers
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='mx-auto max-w-2xl text-sm sm:text-base text-github-fg-muted'
            >
              Choose the perfect tier for your culinary journey. Each tier comes with unique
              features and benefits to help you grow as a chef.
            </motion.p>
          </div>

          {/* Tier Cards */}
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 xl:gap-12 place-items-stretch'>
              {tiers.map((tier) => (
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
                  <TierCard
                    tier={tier}
                    currentTier={currentTier}
                    onMintSuccess={handleMintSuccess}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='px-4 sm:px-6 lg:px-8 mt-16'
          >
            <h2 className='mb-8 text-center text-2xl font-bold text-github-fg-default'>
              Frequently Asked Questions
            </h2>
            <div className='mx-auto grid max-w-3xl gap-6'>
              <div className='rounded-lg border border-github-border-default bg-github-canvas-subtle p-6'>
                <h3 className='mb-2 text-lg font-medium text-github-fg-default'>
                  What are the benefits of upgrading?
                </h3>
                <p className='text-github-fg-muted'>
                  Upgrading to Pro or Group tier unlocks advanced features like AI-powered recipe
                  suggestions, collaborative tools, and priority support. Plus, you'll get access to
                  exclusive content and early access to new features.
                </p>
              </div>
              <div className='rounded-lg border border-github-border-default bg-github-canvas-subtle p-6'>
                <h3 className='mb-2 text-lg font-medium text-github-fg-default'>
                  How do the NFT memberships work?
                </h3>
                <p className='text-github-fg-muted'>
                  Our membership NFTs are soul-bound tokens that represent your tier status. They're
                  non-transferable and provide permanent access to tier benefits. You can upgrade
                  your tier at any time.
                </p>
              </div>
              <div className='rounded-lg border border-github-border-default bg-github-canvas-subtle p-6'>
                <h3 className='mb-2 text-lg font-medium text-github-fg-default'>
                  Can I upgrade my tier later?
                </h3>
                <p className='text-github-fg-muted'>
                  Yes! You can upgrade from Free to Pro, or from Pro to Group tier at any time. Your
                  benefits will be instantly upgraded upon successful minting of the new tier NFT.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </FullPageLayout>
    </BasePageLayout>
  )
}

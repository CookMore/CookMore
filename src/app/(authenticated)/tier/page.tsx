'use client'

import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { ProfileTier } from '@/types/profile'
import { TierCard } from '@/components/ui/TierCard'
import { IconStar } from '@/components/ui/icons'

export default function TierPage() {
  const { hasGroup, hasPro, isLoading, refetch } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  const handleMintSuccess = () => {
    refetch()
  }

  return (
    <div className='container mx-auto px-4 py-12'>
      {/* Header */}
      <div className='mb-12 text-center'>
        <div className='mb-4 flex items-center justify-center gap-2 text-github-accent-fg'>
          <IconStar className='h-6 w-6' />
          <h1 className='text-4xl font-bold text-github-fg-default'>Membership Tiers</h1>
        </div>
        <p className='mx-auto max-w-2xl text-github-fg-muted'>
          Choose the perfect tier for your culinary journey. Each tier comes with unique features
          and benefits to help you grow as a chef.
        </p>
      </div>

      {/* Tier Cards */}
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {Object.values(ProfileTier).map((tier) => (
          <TierCard
            key={tier}
            tier={tier}
            currentTier={currentTier}
            onMintSuccess={handleMintSuccess}
          />
        ))}
      </div>

      {/* FAQ Section */}
      <div className='mt-16'>
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
              non-transferable and provide permanent access to tier benefits. You can upgrade your
              tier at any time.
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
      </div>
    </div>
  )
}

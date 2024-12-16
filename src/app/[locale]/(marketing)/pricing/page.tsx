'use client'

import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'
import { useState } from 'react'
import EnterprisePopover from '@/app/api/components/ui/EnterprisePopover'
import { IconCheck } from '@/app/api/icons'
import { ROUTES } from '@/app/api/routes/routes'

export default function PricingPage() {
  const { login, ready } = usePrivy()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  if (!ready) return null

  const handleEnterpriseContact = () => {
    setIsPopoverOpen(true)
  }

  const closePopover = () => {
    setIsPopoverOpen(false)
  }

  const tiers = [
    {
      title: 'Free',
      price: '$0',
      description: 'Perfect for home cooks',
      features: [
        'Unlimited public recipes',
        'Basic recipe versioning',
        'Community features',
        '$1 platform fee per Recipe NFT minted',
      ],
      buttonText: 'Get Started',
      buttonAction: () => login(),
    },
    {
      title: 'Pro',
      price: '$25 USDC',
      description: 'Unlocks premium features',
      features: ['Soul Bound Token', 'No mint fee for recipes', 'Lifetime access to all features'],
      buttonText: 'Try Pro',
      buttonLink: ROUTES.AUTH.TIER,
      popular: true,
    },
    {
      title: 'Group',
      price: '$100 USDC',
      description: 'For collaborative teams',
      features: ['Soul Bound Token', 'Group recipe editing', 'Shared resources and analytics'],
      buttonText: 'Contact Us',
      buttonLink: ROUTES.AUTH.TIER,
    },
  ]

  return (
    <div className='relative'>
      <div className={`container mx-auto px-4 py-12 ${isPopoverOpen ? 'blur-sm' : ''}`}>
        <h1 className='text-4xl font-bold text-github-fg-default text-center mb-12'>
          Simple, Transparent Pricing
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`flex flex-col justify-between bg-github-canvas-subtle p-6 rounded-lg border ${
                tier.popular
                  ? 'border-2 border-github-success-emphasis transform scale-105'
                  : 'border-github-border-default'
              } hover:shadow-lg transition-shadow`}
            >
              {tier.popular && (
                <div className='absolute top-0 right-0 bg-github-success-emphasis text-white px-3 py-1 text-sm rounded-bl'>
                  Popular
                </div>
              )}
              <div>
                <h2 className='text-xl font-bold text-github-fg-default mb-2'>{tier.title}</h2>
                <p className='text-3xl font-bold text-github-fg-default mb-4'>
                  {tier.price}
                  {tier.title === 'Premium Group Tier' && (
                    <span className='text-sm text-github-fg-muted'> / per person</span>
                  )}
                </p>
                <p className='text-github-fg-muted mb-6'>{tier.description}</p>
                <ul className='space-y-2 mb-6 text-sm text-github-fg-subtle'>
                  {tier.features.map((feature, i) => (
                    <li key={i} className='flex items-center'>
                      <IconCheck className='mr-2 w-5 h-5' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {tier.buttonLink ? (
                <Link href={tier.buttonLink} className='btn btn-primary w-full mt-auto'>
                  {tier.buttonText}
                </Link>
              ) : (
                <button onClick={tier.buttonAction} className='btn btn-primary w-full mt-auto'>
                  {tier.buttonText}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Enterprise Section */}
        <div className='bg-github-canvas-subtle p-6 rounded-lg border border-github-border-default mt-12 max-w-5xl mx-auto hover:shadow-lg transition-shadow'>
          <h2 className='text-xl font-bold text-github-fg-default mb-2'>Enterprise</h2>
          <p className='text-3xl font-bold text-github-fg-default mb-4'>Custom Pricing</p>
          <p className='text-github-fg-muted mb-6'>For restaurants & teams</p>
          <ul className='space-y-2 mb-6 text-sm text-github-fg-subtle'>
            <li className='flex items-center'>
              <IconCheck className='mr-2 w-5 h-5' />
              Everything in Pro
            </li>
            <li className='flex items-center'>
              <IconCheck className='mr-2 w-5 h-5' />
              Team management
            </li>
            <li className='flex items-center'>
              <IconCheck className='mr-2 w-5 h-5' />
              Advanced analytics
            </li>
            <li className='flex items-center'>
              <IconCheck className='mr-2 w-5 h-5' />
              Priority support
            </li>
          </ul>
          <button onClick={handleEnterpriseContact} className='btn btn-primary w-full'>
            Contact Sales
          </button>
        </div>
      </div>

      {/* Render the EnterprisePopover if open */}
      {isPopoverOpen && <EnterprisePopover onClose={closePopover} />}
    </div>
  )
}

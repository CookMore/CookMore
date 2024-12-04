'use client'

import { IconCheck } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    buttonText: 'Current Tier',
    buttonVariant: 'outline' as const,
    disabled: true,
  },
  {
    title: 'Pro',
    price: '$25 USDC',
    description: 'For serious chefs',
    features: [
      'Soul Bound Token',
      'No platform fees',
      'Advanced recipe features',
      'Priority support',
      'Early access to new features',
      'Custom profile branding',
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    title: 'Group',
    price: '$100 USDC',
    description: 'For teams & restaurants',
    features: [
      'All Pro features',
      'Team collaboration',
      'Analytics dashboard',
      'Custom branding',
      'API access',
      'Dedicated support',
    ],
    buttonText: 'Upgrade to Group',
    buttonVariant: 'default' as const,
  },
]

export function PricingSection() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      {tiers.map((tier) => (
        <div
          key={tier.title}
          className={`
            relative flex flex-col
            bg-github-canvas-subtle rounded-lg border
            ${
              tier.popular
                ? 'border-2 border-github-success-emphasis scale-105 shadow-lg'
                : 'border-github-border-default'
            }
            ${tier.popular ? 'z-10' : 'z-0'}
          `}
        >
          {tier.popular && (
            <div className='absolute -top-5 left-0 right-0 flex justify-center'>
              <span className='inline-block px-4 py-1 text-sm font-medium rounded-full bg-github-success-emphasis text-white'>
                Most Popular
              </span>
            </div>
          )}

          <div className='p-8'>
            <h3 className='text-xl font-semibold text-github-fg-default'>{tier.title}</h3>
            <p className='mt-4 text-sm text-github-fg-muted'>{tier.description}</p>
            <p className='mt-8'>
              <span className='text-4xl font-bold text-github-fg-default'>{tier.price}</span>
              {tier.title === 'Free' && (
                <span className='text-sm text-github-fg-muted'> forever</span>
              )}
            </p>

            <ul className='mt-8 space-y-4'>
              {tier.features.map((feature) => (
                <li key={feature} className='flex items-start'>
                  <IconCheck className='w-5 h-5 text-github-success-fg flex-shrink-0' />
                  <span className='ml-3 text-sm text-github-fg-muted'>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='p-8 mt-auto border-t border-github-border-default bg-github-canvas-default rounded-b-lg'>
            {tier.title === 'Free' ? (
              <Button variant={tier.buttonVariant} className='w-full' disabled>
                {tier.buttonText}
              </Button>
            ) : (
              <Link href={`/${tier.title.toLowerCase()}-minting`} className='block'>
                <Button variant={tier.buttonVariant} className='w-full'>
                  {tier.buttonText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PricingSection

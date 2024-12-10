'use client'

import React from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

export default function MarketingExplorePage() {
  const { authenticated } = usePrivy()
  const router = useRouter()

  // If authenticated, redirect to kitchen explore
  React.useEffect(() => {
    if (authenticated) {
      router.push('/kitchen/explore')
    }
  }, [authenticated, router])

  return (
    <div className='container mx-auto px-4 py-16'>
      <h1 className='text-5xl font-bold mb-6 text-github-fg-default text-center'>
        Explore Recipes
      </h1>
      <p className='text-xl mb-8 text-github-fg-muted text-center max-w-3xl mx-auto'>
        Discover a world of culinary creativity. Browse recipes, learn from others, and find
        inspiration for your next masterpiece.
      </p>

      {/* Add marketing content for unauthenticated users */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-4'>Browse Recipes</h3>
          <p className='text-github-fg-muted'>
            Explore our collection of recipes from chefs around the world.
          </p>
        </div>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-4'>Learn Techniques</h3>
          <p className='text-github-fg-muted'>
            Master new cooking methods and improve your skills.
          </p>
        </div>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-4'>Join the Community</h3>
          <p className='text-github-fg-muted'>
            Connect with other chefs and share your culinary journey.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'

export default function LandingPage() {
  const { login, ready } = usePrivy()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show nothing while checking auth status or before mount
  if (!mounted || !ready) return null

  // Show the unauthenticated view
  return (
    <div className='container mx-auto px-4'>
      {/* Additional Unauthenticated Content */}
      <div className='py-16 text-center'>
        <h1 className='text-5xl font-bold mb-6 text-github-fg-default'>
          Version Control for Your Recipes
        </h1>
        <p className='text-xl mb-8 text-github-fg-muted'>
          Fork, branch, and merge your culinary creations. Track changes, collaborate with others,
          and build upon existing recipes.
        </p>

        {/* CTA buttons for unauthenticated users */}
        <div className='space-x-4'>
          <Link
            href='/explore'
            className='bg-github-success-emphasis hover:bg-github-success-fg px-6 py-3 rounded-md inline-block transition-colors'
          >
            Explore Recipes
          </Link>
          <button
            onClick={() => login()}
            className='border border-github-success-emphasis hover:border-github-success-fg px-6 py-3 rounded-md inline-block transition-colors'
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Rest of the marketing content... */}
    </div>
  )
}

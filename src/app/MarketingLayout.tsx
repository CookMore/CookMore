'use client'

import Link from 'next/link'
import { usePrivy } from '@privy-io/react-auth'
import { InstallBanner } from '@/app/pwa/components/InstallBanner'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Footer } from '@/components/Footer'

// Auth Button Component
function AuthButton() {
  const { login, authenticated, ready } = usePrivy()
  const router = useRouter()

  if (!ready) return null

  return (
    <button
      onClick={() => login()}
      className='px-4 py-2 bg-github-success-emphasis hover:bg-github-success-fg text-white rounded-md transition-colors'
    >
      Sign In
    </button>
  )
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { authenticated, ready, user } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      router.push('/kitchen')
    }
  }, [ready, authenticated, user?.wallet?.address, router])

  return (
    <div className='min-h-screen bg-github-canvas-default flex flex-col'>
      <InstallBanner />
      <div className='flex flex-col min-h-[calc(100vh-var(--banner-height,0px))]'>
        <nav className='border-b border-github-border-default'>
          <div className='container mx-auto px-4'>
            <div className='flex items-center justify-between h-16'>
              {/* Logo/Brand */}
              <Link href='/' className='text-xl font-bold text-github-fg-default'>
                CookMore
              </Link>

              {/* Navigation Links */}
              <div className='flex items-center space-x-8'>
                <Link
                  href='/explore'
                  className='text-github-fg-muted hover:text-github-fg-default transition-colors'
                >
                  Explore
                </Link>
                <Link
                  href='/features'
                  className='text-github-fg-muted hover:text-github-fg-default transition-colors'
                >
                  Features
                </Link>
                <Link
                  href='/pricing'
                  className='text-github-fg-muted hover:text-github-fg-default transition-colors'
                >
                  Pricing
                </Link>
                <Link
                  href='/club'
                  className='text-github-fg-muted hover:text-github-fg-default transition-colors'
                >
                  Club
                </Link>
                <AuthButton />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className='flex-grow'>{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

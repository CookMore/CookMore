'use client'

import './globals.css'
import Providers from './providers/providers'
import { PrivyClientProvider } from '@/app/providers/PrivyClientProvider'
import { NetworkProvider } from '@/app/providers/NetworkProvider'
import { PrivyAuthWrapper } from '@/app/providers/PrivyAuthWrapper'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { PanelProvider } from '@/app/providers/PanelProvider'
import { MotionProvider } from '@/app/providers/MotionProvider'
import { ProfileProvider } from '@/app/providers/ProfileProvider'
import { RecipeProvider } from '@/app/providers/RecipeProvider'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Toaster } from 'sonner'
import { inter } from '@/fonts'
import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState, useRef } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { WagmiConfigProvider, queryClient } from '@/lib/web3/wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { useProfile } from '@/hooks/useProfile'
import { usePathname, useRouter } from 'next/navigation'
import { isPublicRoute, isProfileRoute, isAuthOnlyRoute, isProfileCreate } from '@/lib/routes'

function LoadingScreen() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-github-fg-default mb-8'>CookMore</h1>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-success-emphasis mb-4 mx-auto'></div>
        <p className='text-github-fg-muted mb-2'>Initializing...</p>
        <p className='text-sm text-github-fg-subtle'>Setting up your secure environment</p>
      </div>
    </div>
  )
}

function AuthRouter({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user } = usePrivy()
  const { profile, isLoading: profileLoading, loading: profileFetching } = useProfile()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const hasInitialized = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Wait for all loading states to complete
    if (!mounted || !ready || profileLoading || profileFetching) return

    // Only run initialization logic once per route change
    if (hasInitialized.current) return
    hasInitialized.current = true

    // Handle public routes
    if (isPublicRoute(pathname)) {
      if (authenticated && user?.wallet?.address) {
        if (!profile) {
          router.replace('/profile/create')
        } else {
          router.replace('/kitchen')
        }
      }
      return
    }

    // Handle unauthenticated users
    if (!authenticated || !user?.wallet?.address) {
      router.replace('/')
      return
    }

    // Handle profile creation flow
    if (!profile) {
      if (!isProfileRoute(pathname) && !isAuthOnlyRoute(pathname)) {
        router.replace('/profile/create')
      }
      return
    }

    // Redirect from profile creation if profile exists
    if (profile && isProfileCreate(pathname)) {
      router.replace('/profile')
    }
  }, [
    mounted,
    ready,
    authenticated,
    user?.wallet?.address,
    profile,
    profileLoading,
    profileFetching,
    pathname,
    router,
  ])

  // Reset initialization flag on route change
  useEffect(() => {
    hasInitialized.current = false
  }, [pathname])

  // Show loading screen until everything is ready
  if (!mounted || !ready || profileLoading || profileFetching) {
    return <LoadingScreen />
  }

  return children
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning data-theme='dark' className={`${inter.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <MotionProvider>
              <TooltipProvider>
                <PrivyClientProvider>
                  <WagmiConfigProvider>
                    <AuthRouter>
                      <Providers>
                        <NetworkProvider>
                          <PanelProvider>
                            <PrivyAuthWrapper>
                              <ProfileProvider>
                                <RecipeProvider>
                                  <div className='flex flex-col min-h-screen'>
                                    <Header />
                                    <main className='flex-1'>{children}</main>
                                    <Footer />
                                  </div>
                                </RecipeProvider>
                              </ProfileProvider>
                            </PrivyAuthWrapper>
                          </PanelProvider>
                        </NetworkProvider>
                      </Providers>
                    </AuthRouter>
                  </WagmiConfigProvider>
                </PrivyClientProvider>
              </TooltipProvider>
            </MotionProvider>
          </ThemeProvider>
        </QueryClientProvider>
        <Toaster richColors position='top-center' closeButton expand={false} duration={4000} />
      </body>
    </html>
  )
}

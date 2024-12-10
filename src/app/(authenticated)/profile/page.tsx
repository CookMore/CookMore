'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { useProfile } from '@/lib/auth/hooks/useProfile'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'
import { ProfileTypeSwitcher } from './components/editor/ProfileTypeSwitcher'
import { ProfileSidebar } from './components/ui/ProfileSidebar'
import FreeProfileForm from './components/forms/FreeProfileForm'
import ProProfileForm from './components/forms/ProProfileForm'
import GroupProfileForm from './components/forms/GroupProfileForm'
import { PanelContainer } from '@/components/panels/PanelContainer'
import { FormSkeleton } from '@/components/ui/skeletons/FormSkeleton'
import { ProfileTier } from '@/types/profile'
import { getStepsForTier } from '@/app/(authenticated)/profile/steps'
import Image from 'next/image'
import { toast } from 'sonner'
import { PageHeader } from '@/components/ui/PageHeader'

const PRO_IMAGE_URL = 'https://ipfs.io/ipfs/QmQnkRY6b2ckAbYQtn7btBWw3p2LcL2tZReFxViJ3aayk3'
const GROUP_IMAGE_URL = 'https://ipfs.io/ipfs/QmRNqHVG9VHBafsd9ypQt82rZwVMd14Qt2DWXiK5dptJRs'

export default function ProfilePage() {
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const {
    profile,
    currentTier,
    canAccessTier,
    isLoading: profileLoading,
    loading: profileFetching,
    error: profileError,
  } = useProfile()
  const { hasGroup, hasPro, isLoading: tiersLoading } = useNFTTiers()
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeSection, setActiveSection] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  // Set hydration state
  useEffect(() => {
    setIsHydrated(true)
    return () => setIsHydrated(false) // Cleanup on unmount
  }, [])

  // Handle profile redirect
  useEffect(() => {
    if (!ready || profileLoading || profileFetching) return

    if (!profile) {
      router.replace('/profile/create')
    }
  }, [ready, profile, profileLoading, profileFetching, router])

  // Authentication check with error handling
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!ready) return

        if (!authenticated) {
          console.log('Not authenticated, redirecting to login')
          router.replace('/')
          return
        }

        if (authenticated && !user?.wallet?.address) {
          console.log('No wallet connected, redirecting to connect')
          router.replace('/profile/create')
          return
        }
      } catch (error) {
        console.error('Auth check error:', error)
        toast.error('Authentication error. Please try again.')
      }
    }

    checkAuth()
  }, [ready, authenticated, user?.wallet?.address, router])

  // Show nothing during SSR
  if (!isHydrated) {
    return null
  }

  // Handle loading states
  const isLoading = !ready || profileLoading || profileFetching || tiersLoading
  if (isLoading) {
    return (
      <PanelContainer>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-success-emphasis mb-4'></div>
            <p className='text-sm text-github-fg-muted'>
              {!ready ? 'Initializing...' : 'Loading profile...'}
            </p>
          </div>
        </div>
      </PanelContainer>
    )
  }

  if (profileError) {
    console.error('Profile error:', profileError)
    return (
      <PanelContainer>
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <p className='text-red-500 mb-4'>Failed to load profile</p>
            <button
              onClick={() => window.location.reload()}
              className='text-github-accent-fg hover:underline'
            >
              Try again
            </button>
          </div>
        </div>
      </PanelContainer>
    )
  }

  // Remove the direct redirect during render
  if (!profile) {
    return null
  }

  const getTierImage = () => {
    if (currentTier === ProfileTier.PRO) return PRO_IMAGE_URL
    if (currentTier === ProfileTier.GROUP) return GROUP_IMAGE_URL
    return null
  }

  // Determine actual tier based on NFT ownership
  const actualTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  const renderActiveForm = () => {
    switch (actualTier) {
      case ProfileTier.FREE:
        return <FreeProfileForm currentSection={activeSection} initialData={profile} />
      case ProfileTier.PRO:
        return canAccessTier(ProfileTier.PRO) ? (
          <ProProfileForm currentSection={activeSection} initialData={profile} />
        ) : null
      case ProfileTier.GROUP:
        return canAccessTier(ProfileTier.GROUP) ? (
          <GroupProfileForm currentSection={activeSection} initialData={profile} />
        ) : null
      default:
        return <FreeProfileForm currentSection={activeSection} initialData={profile} />
    }
  }

  return (
    <div>
      <PageHeader title='Profile Settings' />
      <PanelContainer>
        <div className='flex min-h-screen'>
          <div className='relative w-[280px]'>
            <ProfileSidebar
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              currentStep={activeSection}
              setCurrentStep={setActiveSection}
              steps={getStepsForTier(actualTier)}
            />

            {actualTier !== ProfileTier.FREE && getTierImage() && (
              <div className='absolute top-3 right-4 z-[100000]'>
                <div className='relative w-8 h-8 transform hover:scale-105 transition-transform'>
                  <Image
                    src={getTierImage()!}
                    alt={`${actualTier} NFT`}
                    width={32}
                    height={32}
                    className='rounded-md ring-1 ring-github-border-default shadow-lg'
                    priority
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          <main className={`flex-1 ${isExpanded ? 'ml-[280px]' : 'ml-[48px]'}`}>
            <div className='p-6'>
              <ProfileTypeSwitcher />
              <Suspense fallback={<FormSkeleton />}>{renderActiveForm()}</Suspense>
            </div>
          </main>
        </div>
      </PanelContainer>
    </div>
  )
}

'use client'

import { IconUser, IconSettings } from '@/app/api/icons'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ProfileSidebar } from '@/app/[locale]/(authenticated)/profile/components/ui/ProfileSidebar'
import { useProfile } from '@/app/[locale]/(authenticated)/profile'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { ProfileEdgeProvider } from './providers/edge/ProfileEdgeProvider'
import { ProfileTier } from './profile'

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname()
  const { user } = usePrivy()
  const isCreatingProfile = pathname?.includes('/profile/create')
  const walletAddress = user?.wallet?.address

  // Only use profile hook if not creating profile
  const { currentTier: tier } = !isCreatingProfile ? useProfile() : { currentTier: null }
  const [currentStep, setCurrentStep] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)

  const steps = [
    {
      id: 'profile',
      label: 'Profile',
      icon: IconUser,
      tier: ProfileTier.FREE,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: IconSettings,
      tier: ProfileTier.FREE,
    },
  ]

  // Wrap all content with ProfileEdgeProvider if we have a wallet address
  const content = walletAddress ? (
    <ProfileEdgeProvider address={walletAddress}>
      {isCreatingProfile ? (
        <div className='min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto px-6 py-8'>
          {children}
        </div>
      ) : (
        <DualSidebarLayout
          leftSidebar={
            <ProfileSidebar
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              tier={tier || ProfileTier.FREE}
            />
          }
          isLeftSidebarExpanded={isExpanded}
        >
          {/* Main content area */}
          <div className='min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto px-6 py-8'>
            {children}
          </div>
        </DualSidebarLayout>
      )}
    </ProfileEdgeProvider>
  ) : (
    // Loading state or error state when no wallet address is available
    <div className='min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto px-6 py-8 flex items-center justify-center'>
      <p>Loading wallet...</p>
    </div>
  )

  return content
}

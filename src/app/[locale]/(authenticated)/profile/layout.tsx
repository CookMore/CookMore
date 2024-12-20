'use client'

import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ProfileSidebar } from './components/ui/ProfileSidebar'
import { useProfile } from '@/app/[locale]/(authenticated)/profile'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname()
  const isCreatingProfile = pathname?.includes('/profile/create')

  // Only use profile hook if not creating profile
  const { currentTier: tier } = !isCreatingProfile ? useProfile() : { currentTier: null }
  const [currentStep, setCurrentStep] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)

  const steps = [
    { title: 'Profile', href: '/profile' },
    { title: 'Settings', href: '/profile/settings' },
  ]

  // If creating profile, render without sidebar
  if (isCreatingProfile) {
    return (
      <div className='min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto px-6 py-8'>{children}</div>
    )
  }

  return (
    <DualSidebarLayout
      leftSidebar={
        <ProfileSidebar
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          tier={tier}
        />
      }
    >
      {/* Main content area */}
      <div className='min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto px-6 py-8'>{children}</div>
    </DualSidebarLayout>
  )
}

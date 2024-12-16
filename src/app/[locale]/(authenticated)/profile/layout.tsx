'use client'

import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ProfileSidebar } from './components/ui/ProfileSidebar'
import { useProfileSystem } from './components/hooks'
import { useState } from 'react'

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const { steps, currentStep, setCurrentStep, tier } = useProfileSystem()
  const [isExpanded, setIsExpanded] = useState(true)

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

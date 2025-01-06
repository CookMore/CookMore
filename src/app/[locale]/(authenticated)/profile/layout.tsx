import { unstable_setRequestLocale } from 'next-intl/server'
import { ProfileEdgeProvider } from './providers/edge/ProfileEdgeProvider'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import React from 'react'

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<{ walletAddress: string; locale: string }>
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const { walletAddress, locale } = await params
  await unstable_setRequestLocale(locale)

  return (
    <ProfileEdgeProvider address={walletAddress}>
      <DualSidebarLayout isLeftSidebarExpanded={true}>
        <div className='min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto px-6 py-8'>
          {children}
        </div>
      </DualSidebarLayout>
    </ProfileEdgeProvider>
  )
}

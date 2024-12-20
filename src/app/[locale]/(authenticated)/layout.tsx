'use client'

import { ProfileProvider } from '@/app/[locale]/(authenticated)/profile'
import { PanelProvider } from '@/app/api/providers/features/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { ClientLayout } from '@/app/api/layouts/ClientLayout'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { usePathname } from 'next/navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCreatingProfile = pathname?.includes('/profile/create')

  // If creating profile, don't wrap with ProfileProvider
  if (isCreatingProfile) {
    return (
      <PanelProvider>
        <ClientLayout>{children}</ClientLayout>
        <PanelContainer />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </PanelProvider>
    )
  }

  return (
    <ProfileProvider>
      <PanelProvider>
        <ClientLayout>{children}</ClientLayout>
        <PanelContainer />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </PanelProvider>
    </ProfileProvider>
  )
}

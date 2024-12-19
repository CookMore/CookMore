'use client'

import { ProfileProvider } from '@/app/[locale]/(authenticated)/profile'
import { PanelProvider } from '@/app/api/providers/features/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { ClientLayout } from '@/app/api/layouts/ClientLayout'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
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

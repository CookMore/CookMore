import { unstable_setRequestLocale } from 'next-intl/server'
import { PanelProvider } from '@/app/api/providers/features/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'

interface WikiLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function WikiLayout({ children, params }: WikiLayoutProps) {
  const { locale } = await params
  await unstable_setRequestLocale(locale)

  return (
    <PanelProvider>
      <DualSidebarLayout isLeftSidebarExpanded={true}>
        <div className='min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto px-6 py-8'>
          {children}
        </div>
      </DualSidebarLayout>
      <PanelContainer />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </PanelProvider>
  )
}

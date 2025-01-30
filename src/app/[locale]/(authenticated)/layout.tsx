'use client'

import { Providers } from '@/app/api/providers/providers'
import { HeaderWrapper } from '@/app/api/header/HeaderWrapper'
import { FooterWrapper } from '@/app/api/footer/FooterWrapper'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { usePathname } from 'next/navigation'

// Example: Assuming you have a way to get the locale, e.g., from context or props
const locale = 'en' // Replace with actual logic to get the locale

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCreatingProfile = pathname?.includes('/profile/create')

  const layoutContent = (
    <div className='flex flex-col min-h-screen'>
      <HeaderWrapper />
      <main className='flex-1 overflow-y-auto'>{children}</main>
      <FooterWrapper />
    </div>
  )

  // If creating profile, don't wrap with ProfileProvider
  if (isCreatingProfile) {
    return (
      <Providers locale={locale}>
        {layoutContent}
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </Providers>
    )
  }

  return (
    <Providers locale={locale}>
      {layoutContent}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </Providers>
  )
}

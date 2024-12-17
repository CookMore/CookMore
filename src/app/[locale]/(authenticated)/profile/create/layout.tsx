'use client'

import { BasePageLayout } from '@/app/api/layouts/BasePageLayout'

export default function ProfileCreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <BasePageLayout>
      <div className='w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='bg-github-canvas-default rounded-lg border border-github-border-default p-4 sm:p-6'>
          {children}
        </div>
      </div>
    </BasePageLayout>
  )
}

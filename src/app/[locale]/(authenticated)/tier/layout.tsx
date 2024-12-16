'use client'

import { BasePageLayout } from '@/app/api/layouts/BasePageLayout'
import { FullPageLayout } from '@/app/api//layouts/FullPage'

export default function TierLayout({ children }: { children: React.ReactNode }) {
  return (
    <BasePageLayout>
      <FullPageLayout>{children}</FullPageLayout>
    </BasePageLayout>
  )
}

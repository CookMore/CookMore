'use client'

import { BasePageLayout } from '@/components/layouts/BasePageLayout'
import { FullPageLayout } from '@/components/layouts/FullPage'

export default function TierLayout({ children }: { children: React.ReactNode }) {
  return (
    <BasePageLayout>
      <FullPageLayout>{children}</FullPageLayout>
    </BasePageLayout>
  )
}

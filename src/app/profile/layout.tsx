'use client'

import { DualSidebarLayout } from '@/components/layouts/DualSidebarLayout'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <DualSidebarLayout>{children}</DualSidebarLayout>
}

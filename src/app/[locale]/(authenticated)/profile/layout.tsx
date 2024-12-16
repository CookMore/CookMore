'use client'

import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'

interface ProfileLayoutProps {
  children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <DualSidebarLayout>{children}</DualSidebarLayout>
}

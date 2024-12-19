'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { FormSection } from '@/app/api/form/FormSection'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { PageHeader } from '@/app/api/header/PageHeader'

// Lazy load components with consistent loading states
const AdminComponents = {
  RoleManager: dynamic(
    () => import('./components/RoleManager').then((mod) => ({ default: mod.RoleManager })),
    { loading: () => <LoadingSkeleton className='h-48' />, ssr: false }
  ),
  ProfileManager: dynamic(
    () => import('./components/ProfileManager').then((mod) => ({ default: mod.ProfileManager })),
    { loading: () => <LoadingSkeleton className='h-48' />, ssr: false }
  ),
  NFTManager: dynamic(
    () => import('./components/NFTManager').then((mod) => ({ default: mod.NFTManager })),
    { loading: () => <LoadingSkeleton className='h-48' />, ssr: false }
  ),
  SystemStatus: dynamic(
    () => import('./components/SystemStatus').then((mod) => ({ default: mod.SystemStatus })),
    { loading: () => <LoadingSkeleton className='h-48' />, ssr: false }
  ),
  DeletedProfiles: dynamic(
    () => import('./components/DeletedProfiles').then((mod) => ({ default: mod.DeletedProfiles })),
    { loading: () => <LoadingSkeleton className='h-48' />, ssr: false }
  ),
}

const AdminSection = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) => (
  <FormSection title={title} description={description}>
    <Suspense fallback={<LoadingSkeleton className='h-48' />}>{children}</Suspense>
  </FormSection>
)

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title='Admin Dashboard' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <AdminSection title='System Status' description='Monitor contract states and system health'>
          <AdminComponents.SystemStatus />
        </AdminSection>

        <AdminSection
          title='Role Management'
          description='Manage Feature Manager roles and permissions'
        >
          <AdminComponents.RoleManager />
        </AdminSection>

        <AdminSection
          title='Profile Management'
          description='Manage user profiles and handle administrative actions'
        >
          <AdminComponents.ProfileManager />
        </AdminSection>

        <AdminSection
          title='NFT Management'
          description='Update NFT artwork and manage token settings'
        >
          <AdminComponents.NFTManager />
        </AdminSection>

        <AdminSection title='Deleted Profiles' description='View history of deleted profiles'>
          <AdminComponents.DeletedProfiles />
        </AdminSection>
      </div>
    </div>
  )
}

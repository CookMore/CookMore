'use client'

import { Suspense } from 'react'
import { FormSection } from '@/app/api/form/FormSection'
import { LoadingSkeleton } from '@/app/api/loading/LoadingSkeleton'
import { PageHeader } from '@/app/api/header/PageHeader'
import ProfileManager from './components/ProfileManager'
import RoleManager from './components/RoleManager'
import NFTManager from './components/NFTManager'
import SystemStatus from './components/SystemStatus'
import DeletedProfiles from './components/DeletedProfiles'
import AttestationManager from './components/AttestationManager'

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
    <div className='space-y-8'>
      <PageHeader title='Admin Dashboard' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <AdminSection title='System Status' description='Monitor contract states and system health'>
          <SystemStatus />
        </AdminSection>

        <AdminSection
          title='Role Management'
          description='Manage Feature Manager roles and permissions'
        >
          <RoleManager />
        </AdminSection>

        <AdminSection
          title='Profile Management'
          description='Manage user profiles and handle administrative actions'
        >
          <ProfileManager />
        </AdminSection>

        <AdminSection
          title='NFT Management'
          description='Update NFT artwork and manage token settings'
        >
          <NFTManager />
        </AdminSection>

        <AdminSection title='Deleted Profiles' description='View history of deleted profiles'>
          <DeletedProfiles />
        </AdminSection>

        <AdminSection
          title='Attestation Management'
          description='Create or revoke EAS attestations for applicants/employers'
        >
          <AttestationManager />
        </AdminSection>
      </div>
    </div>
  )
}

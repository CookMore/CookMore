'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { FormSection } from '@/components/ui/form/FormSection'
import { LoadingSkeleton } from '@/components/ui/skeletons/LoadingSkeleton'

// Lazy load components
const RoleManager = dynamic(
  () =>
    import('@/app/(authenticated)/admin/components/RoleManager').then((mod) => ({
      default: mod.RoleManager,
    })),
  {
    loading: () => <LoadingSkeleton className='h-48' />,
    ssr: false,
  }
)

const ProfileManager = dynamic(
  () =>
    import('@/app/(authenticated)/admin/components/ProfileManager').then((mod) => ({
      default: mod.ProfileManager,
    })),
  {
    loading: () => <LoadingSkeleton className='h-48' />,
    ssr: false,
  }
)

const NFTManager = dynamic(
  () =>
    import('@/app/(authenticated)/admin/components/NFTManager').then((mod) => ({
      default: mod.NFTManager,
    })),
  {
    loading: () => <LoadingSkeleton className='h-48' />,
    ssr: false,
  }
)

const SystemStatus = dynamic(
  () =>
    import('@/app/(authenticated)/admin/components/SystemStatus').then((mod) => ({
      default: mod.SystemStatus,
    })),
  {
    loading: () => <LoadingSkeleton className='h-48' />,
    ssr: false,
  }
)

const DeletedProfiles = dynamic(
  () => import('./components/DeletedProfiles').then((mod) => ({ default: mod.DeletedProfiles })),
  {
    loading: () => <LoadingSkeleton className='h-48' />,
    ssr: false,
  }
)

export default function AdminDashboard() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* System Status */}
      <FormSection title='System Status' description='Monitor contract states and system health'>
        <Suspense fallback={<LoadingSkeleton className='h-48' />}>
          <SystemStatus />
        </Suspense>
      </FormSection>

      {/* Role Management */}
      <FormSection
        title='Role Management'
        description='Manage Feature Manager roles and permissions'
      >
        <Suspense fallback={<LoadingSkeleton className='h-48' />}>
          <RoleManager />
        </Suspense>
      </FormSection>

      {/* Profile Management */}
      <FormSection
        title='Profile Management'
        description='Manage user profiles and handle administrative actions'
      >
        <Suspense fallback={<LoadingSkeleton className='h-48' />}>
          <ProfileManager />
        </Suspense>
      </FormSection>

      {/* NFT Management */}
      <FormSection
        title='NFT Management'
        description='Update NFT artwork and manage token settings'
      >
        <Suspense fallback={<LoadingSkeleton className='h-48' />}>
          <NFTManager />
        </Suspense>
      </FormSection>

      {/* Deleted Profiles */}
      <FormSection title='Deleted Profiles' description='View history of deleted profiles'>
        <Suspense fallback={<LoadingSkeleton className='h-48' />}>
          <DeletedProfiles />
        </Suspense>
      </FormSection>
    </div>
  )
}

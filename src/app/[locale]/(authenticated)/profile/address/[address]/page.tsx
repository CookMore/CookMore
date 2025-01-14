'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { usePrivy, User } from '@privy-io/react-auth'
import { ProfileDisplay } from '../../components/ui/ProfileDisplay'
import { ProfileSkeleton } from '../../components/ui/ProfileSkeleton'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { PageHeader } from '@/app/api/header/PageHeader'
import ProfilePage from '../../page'
import { getProfile } from '@/app/[locale]/(authenticated)/profile/services/server/profile.service'
import type {
  ProfileMetadata,
  ProfileVersion,
  ProfileTier,
  SocialLinks,
  Preferences,
} from '../../profile'

export default function PublicProfilePage() {
  const params = useParams()
  const { address } = params
  const [profileMetadata, setProfileMetadata] = useState<ProfileMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { user } = usePrivy()
  const walletAddress = user?.wallet?.address || address

  const { hasProfile, currentTier } = useAuth()

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (typeof walletAddress !== 'string' || !walletAddress.startsWith('0x')) {
          setError('Invalid address format')
          return
        }

        const profileData = await getProfile(walletAddress.toLowerCase(), 'sepolia')
        if (!profileData) {
          setError('No profile creation event found')
          return
        }

        setProfileMetadata(profileData.profileMetadata)
      } catch (err) {
        setError('Failed to fetch profile')
      }
    }

    fetchProfile()
  }, [walletAddress])

  function mapUserToProfileMetadata(user: User): ProfileMetadata {
    return {
      profileId: user.id,
      version: '1.0' as ProfileVersion,
      tier: currentTier as ProfileTier,
      name: user.email || 'Unknown',
      bio: '',
      description: 'User profile',
      avatar: '',
      image: '',
      banner: '',
      location: '',
      social: {
        urls: [],
        labels: [],
      } as SocialLinks,
      preferences: {
        theme: 'light',
        notifications: true,
        displayEmail: true,
        displayLocation: true,
        email: user.email,
      } as Preferences,
      attributes: {
        version: '1.0',
        tier: currentTier as ProfileTier,
        timestamp: Date.now(),
        ipfsNotesCID: '',
      },
      baseName: 'Default Base Name',
      organizationInfo: {
        type: 'other',
        establishedYear: '2023',
        size: 'small',
        team: [],
      },
      compliance: {
        certifications: [],
        licenses: [],
      },
      businessOperations: {
        operatingHours: [],
        serviceTypes: [],
        capacity: {},
        specializations: [],
      },
      experience: {
        current: {
          title: '',
          company: '',
          startDate: '',
        },
        history: [],
      },
      culinaryInfo: {
        expertise: 'beginner',
        specialties: [],
        dietaryPreferences: [],
        cuisineTypes: [],
        techniques: [],
        equipment: [],
      },
      achievements: {
        recipesCreated: 0,
        recipesForked: 0,
        totalLikes: 0,
        badges: [],
      },
    }
  }

  return (
    <div>
      <PageHeader title={user?.wallet?.address || 'Chef Profile'} />
      <PanelContainer>
        <Suspense fallback={<ProfileSkeleton />}>
          {walletAddress && <ProfilePage address={String(walletAddress)} />}
          {user && (
            <ProfileDisplay
              profile={profileMetadata || mapUserToProfileMetadata(user)}
              currentTier={currentTier}
              isPublicView
              hasProfile={hasProfile}
            />
          )}
        </Suspense>
        {error && <div className='text-red-500'>{error}</div>}
        <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'>Test</button>
      </PanelContainer>
    </div>
  )
}

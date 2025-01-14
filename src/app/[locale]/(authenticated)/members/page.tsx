'use client'

import React, { useEffect, useState } from 'react'
import MembersLayout from './layout'
import { useProfileContract } from '@/app/[locale]/(authenticated)/profile/components/hooks/contracts/useProfileContract'
import { ProfileCard } from '@/app/[locale]/(authenticated)/profile/components/ui/ProfileCard'

// Define the Profile type with expected properties
type Profile = {
  profileId: string
  name: string
  bio: string
  avatar: string
  banner?: string
  education?: {
    institution: string
    degree?: string
    field?: string
    startYear: string
    endYear?: string
    location?: string
  }[]
  culinaryInfo?: {
    expertise: 'beginner' | 'intermediate' | 'advanced' | 'professional'
    specialties: string[]
    dietaryPreferences: string[]
    cuisineTypes: string[]
    techniques: string[]
    equipment: string[]
  }
  version: ProfileVersion
  tier: ProfileTier
  social: SocialLinks
  experience?: {
    current?: {
      title: string
      company: string
      location?: string
      startDate: string
      description?: string
    }
    history?: Array<{
      title: string
      company: string
      location?: string
      startDate: string
      endDate?: string
      description?: string
    }>
  }
}

export default function MembersPage() {
  const { logs, fetchAllLogs, isLoading, error } = useProfileContract()
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    fetchAllLogs()
  }, [fetchAllLogs])

  useEffect(() => {
    const fetchMetadata = async () => {
      const fetchedProfiles = await Promise.all(
        logs.map(async (log: any) => {
          const response = await fetch(
            `https://gateway.pinata.cloud/ipfs/${log.metadataURI.split('ipfs://')[1]}`
          )
          const metadata = await response.json()
          return {
            profileId: log.profileId || '0',
            name: metadata.name || 'Unknown',
            bio: metadata.bio || '',
            avatar: metadata.avatar || '',
            banner: metadata.banner,
            education: metadata.education,
            culinaryInfo: metadata.culinaryInfo,
            version: metadata.version,
            tier: metadata.tier,
            social: metadata.social,
            experience: metadata.experience,
          }
        })
      )
      setProfiles(fetchedProfiles)
    }

    if (logs.length > 0) {
      fetchMetadata()
    }
  }, [logs])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <MembersLayout>
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-4'>Members Roster</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-visible'>
          {profiles.map((profile: Profile) => (
            <ProfileCard key={profile.profileId} profile={profile} />
          ))}
        </div>
      </div>
    </MembersLayout>
  )
}

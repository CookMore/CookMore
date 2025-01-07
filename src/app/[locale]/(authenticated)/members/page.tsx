'use client'

import React, { useEffect } from 'react'
import { ProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import MembersLayout from './layout'
import { useProfileContract } from '@/app/[locale]/(authenticated)/profile/components/hooks/contracts/useProfileContract'

export default function MembersPage() {
  const { logs, fetchAllLogs, isLoading, error } = useProfileContract()

  useEffect(() => {
    fetchAllLogs()
  }, [fetchAllLogs])

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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {logs.map((profile: ProfileMetadata) => (
            <div key={profile.profileId} className='border p-4 rounded shadow'>
              <h2 className='text-xl font-semibold'>{profile.name}</h2>
              <p>{profile.bio}</p>
              <img
                src={`https://ipfs.io/ipfs/${profile.avatar}`}
                alt={profile.name}
                className='w-16 h-16 rounded-full'
              />
            </div>
          ))}
        </div>
      </div>
    </MembersLayout>
  )
}

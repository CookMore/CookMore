'use client'

import { useState } from 'react'
import { useProfileRegistry } from '@/hooks/useProfileRegistry'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/FormInput'
import { useToast } from '@/components/ui/use-toast'
import { ProfileTier } from '@/types/profile'

export function ProfileManager() {
  const [profileId, setProfileId] = useState('')
  const [loading, setLoading] = useState(false)
  const { getProfile } = useProfileRegistry()
  const { toast } = useToast()

  const handleFetchProfile = async () => {
    try {
      setLoading(true)
      const profile = await getProfile(profileId)
      toast({
        title: 'Profile Found',
        description: `Profile ID: ${profileId}\nTier: ${
          profile.tier ? ProfileTier[profile.tier] : 'Unknown'
        }`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <FormInput
        name='profileId'
        label='Profile ID'
        value={profileId}
        onChange={(e) => setProfileId(e.target.value)}
        placeholder='Enter profile ID'
      />

      <div className='flex gap-4'>
        <Button onClick={handleFetchProfile} disabled={loading || !profileId}>
          Fetch Profile
        </Button>
      </div>
    </div>
  )
}

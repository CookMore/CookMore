'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/hooks'
import { getProfile } from '@/lib/services/profile'
import type { Profile } from '@/types/profile'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!user?.wallet?.address) {
        setProfile(null)
        setIsLoading(false)
        return
      }

      try {
        const response = await getProfile(user.wallet.address)
        setProfile(response.data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load profile'))
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user?.wallet?.address])

  return { profile, isLoading, error }
}

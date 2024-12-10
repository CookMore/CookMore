'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProfileService } from '@/lib/services/profile'
import { toast } from 'sonner'
import type { Profile, ProfileMetadata } from '@/types/profile'

export function useProfileData(address: string | undefined) {
  const queryClient = useQueryClient()

  const {
    data: profileResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', address],
    queryFn: () =>
      address ? ProfileService.getProfile(address) : Promise.reject('No address provided'),
    enabled: !!address,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  })

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (data: Partial<ProfileMetadata>) => {
      if (!address) {
        throw new Error('No address provided')
      }
      const response = await ProfileService.updateProfile(address, data)
      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', address] })
      toast.success('Your changes have been saved')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    profile: profileResponse?.data,
    isLoading,
    isUpdating,
    error,
    updateProfile,
    refetch,
  }
}

export const useProfile = useProfileData

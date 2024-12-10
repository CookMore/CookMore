'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProfileService } from '@/lib/services/profile'
import { toast } from 'sonner'
import type { Profile, ProfileMetadata } from '@/types/profile'

export function useProfile(address: string | undefined) {
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
    onError: (error: Error) => {
      // Only show error toast if it's not a "No address provided" error
      if (error.message !== 'No address provided') {
        toast({
          title: 'Error loading profile',
          description: error.message,
          variant: 'destructive',
        })
      }
    },
  })

  const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
    mutationFn: (data: Partial<ProfileMetadata>) =>
      address ? ProfileService.updateProfile(address, data) : Promise.reject('No address provided'),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', address])
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      })
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

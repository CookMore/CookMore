'use client'

import { useState } from 'react'
import { useContract } from './useContract'
import { PROFILE_SYSTEM_ABI } from '../abis'
import { PROFILE_SYSTEM_ADDRESS } from '../addresses'
import type { ProfileFormData } from '@/types/profile'

export function useProfileSystem() {
  const [isLoading, setIsLoading] = useState(false)
  const contract = useContract(PROFILE_SYSTEM_ADDRESS, PROFILE_SYSTEM_ABI)

  const createProfile = async (data: ProfileFormData) => {
    if (!contract) {
      throw new Error('Contract not initialized')
    }

    try {
      setIsLoading(true)
      const tx = await contract.createProfile(data)
      const receipt = await tx.wait()
      return { success: true, receipt }
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createProfile,
    isLoading,
  }
}

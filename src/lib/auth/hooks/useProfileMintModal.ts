'use client'

import { create } from 'zustand'
import { ProfileTier } from '@/types/profile'

interface ProfileMintModalStore {
  isOpen: boolean
  tier: ProfileTier | null
  profileData: any | null
  open: (tier: ProfileTier, data: any) => void
  close: () => void
}

export const useProfileMintModal = create<ProfileMintModalStore>((set) => ({
  isOpen: false,
  tier: null,
  profileData: null,
  open: (tier, data) => set({ isOpen: true, tier, profileData: data }),
  close: () => set({ isOpen: false, tier: null, profileData: null }),
}))

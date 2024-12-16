'use client'
import { useContext } from 'react'
import { ProfileContext } from '@/app/api/providers/ProfileProvider'

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

'use client'

import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { usePrivy } from '@privy-io/react-auth'
import { ProfileDisplay } from './components/ui/ProfileDisplay'
import CreateProfileClient from './create/CreateProfileClient'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { profileABI } from '@/app/api/blockchain/abis/profile'
import { ProfileTier } from './profile'

interface ProfilePageProps {
  address?: string
}

const ProfilePage: React.FC<ProfilePageProps> = ({ address }) => {
  const { user, hasProfile, currentTier } = useAuth()
  const { user: privyUser } = usePrivy()
  const walletAddress = address || privyUser?.wallet?.address

  console.log('Received Address in ProfilePage:', walletAddress)

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [metadata, setMetadata] = useState<any>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!walletAddress) return

      try {
        const sepoliaProvider = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
        )
        const contract = new ethers.Contract(
          '0x0C3897538e000dAdAEA1bb10D5757fC473972018',
          profileABI,
          sepoliaProvider
        )

        const profile = await contract.getProfile(walletAddress)
        const profileId = profile.profileId
        console.log('Profile ID:', profileId.toString())

        setProfileData(profile)
        setMetadata(profile.metadataURI)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfileData()
  }, [walletAddress])

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  if (!profileData) {
    return <div>Profile data is not available.</div>
  }

  const isOwnProfile = user?.wallet?.address === profileData?.wallet

  return isEditing ? (
    <CreateProfileClient mode='edit' />
  ) : (
    <ProfileDisplay
      profile={profileData}
      metadata={metadata}
      currentTier={currentTier as ProfileTier}
      isPublicView={!isOwnProfile}
      hasProfile={hasProfile}
      onEdit={isOwnProfile ? () => setIsEditing(true) : undefined}
    />
  )
}

export default ProfilePage

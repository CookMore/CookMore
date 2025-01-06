'use client'

import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { usePrivy } from '@privy-io/react-auth'
import { ProfileDisplay } from './components/ui/ProfileDisplay'
import CreateProfileClient from './create/CreateProfileClient'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { profileABI } from '@/app/api/blockchain/abis/profile'
import { ProfileTier, Profile } from './profile'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'
import { IconUser, IconSettings } from '@/app/api/icons'
import React from 'react'
import { ProfileStepProvider } from './ProfileStepContext'
import { Button } from '@/app/api/components/ui/button'

interface ProfilePageProps {
  address?: string
}

const ProfilePage: React.FC<ProfilePageProps> = ({ address }) => {
  const { user, hasProfile, currentTier } = useAuth()
  const { user: privyUser } = usePrivy()
  const walletAddress = address || privyUser?.wallet?.address

  console.log('Received Address in ProfilePage:', walletAddress)

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<Profile | null>(null)

  const toggleEditing = () => setIsEditing((prev) => !prev) // Toggle function

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

        // Fetch metadata from IPFS
        const metadataResponse = await fetch(ipfsService.getHttpUrl(profile.metadataURI))
        const metadataJson = await metadataResponse.json()

        // Ensure metadataJson matches ProfileMetadata type
        const parsedProfile: Profile = {
          ...profile,
          metadata: metadataJson,
          tokenId: profileId.toString(),
          tier: currentTier as ProfileTier,
        }

        setProfileData(parsedProfile)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfileData()
  }, [walletAddress, currentTier])

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  if (!walletAddress) {
    return <div>Loading wallet...</div>
  }

  const isOwnProfile = user?.wallet?.address === profileData?.owner

  console.log('Is Own Profile:', isOwnProfile)

  return (
    <ProfileStepProvider tier={currentTier as ProfileTier}>
      <div className='flex-1'>
        {isEditing ? (
          <CreateProfileClient mode='edit' />
        ) : (
          profileData && (
            <div>
              <ProfileDisplay
                profile={profileData.metadata}
                currentTier={currentTier as ProfileTier}
                isPublicView={!isOwnProfile}
                hasProfile={hasProfile}
                onEdit={isOwnProfile ? () => setIsEditing(true) : undefined}
              />

              <Button onClick={toggleEditing} className='mt-4'>
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </div>
          )
        )}
      </div>
    </ProfileStepProvider>
  )
}

export default ProfilePage

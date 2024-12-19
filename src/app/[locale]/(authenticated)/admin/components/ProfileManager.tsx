'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/app/api/components/ui/button'
import { FormInput } from '@/app/api/form/FormInput'
import { toast } from 'sonner'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfile'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { getContracts } from '@/app/api/blockchain/server/getContracts'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { baseSepolia, base } from 'viem/chains'
import { createPublicClient, http } from 'viem'

function ProfileManagerSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-10 w-full bg-github-canvas-subtle animate-pulse rounded' />
      <div className='h-9 w-32 bg-github-canvas-subtle animate-pulse rounded' />
    </div>
  )
}

export function ProfileManager() {
  const { profile } = useProfile()
  const [profileId, setProfileId] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (profile?.owner) {
      hasRequiredRole(profile.owner, ROLES.ADMIN).then(setHasAccess)
    }
  }, [profile?.owner])

  // Role check
  if (!hasAccess) {
    return null
  }

  const handleFetchProfile = async () => {
    try {
      setLoading(true)
      const { profileContract } = await getContracts()
      const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      })

      if (!publicClient) {
        throw new Error('Public client not available')
      }

      const result = (await publicClient.readContract({
        ...profileContract,
        functionName: 'getProfile',
        args: [BigInt(profileId)],
      })) as [boolean, bigint, bigint, string]

      const [exists, tier, tokenId, metadataURI] = result

      if (!exists) {
        throw new Error('Profile not found')
      }

      toast.success('Profile Found', {
        description: `Profile ID: ${profileId}
Tier: ${ProfileTier[Number(tier)]}
Token ID: ${tokenId}
Metadata URI: ${metadataURI}`,
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to fetch profile',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Suspense fallback={<ProfileManagerSkeleton />}>
      <div className='space-y-4'>
        <FormInput
          name='profileId'
          label='Profile ID'
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          placeholder='Enter profile ID'
          disabled={loading}
        />

        <div className='flex gap-4'>
          <Button onClick={handleFetchProfile} disabled={loading || !profileId} className='text-sm'>
            {loading ? (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-github-accent-emphasis' />
            ) : (
              'Fetch Profile'
            )}
          </Button>
        </div>
      </div>
    </Suspense>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/routes'
import { ProfileTier } from '@/types/profile'

export default function SelectTierPage() {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<ProfileTier | null>(null)

  const handleTierSelect = (tier: ProfileTier) => {
    console.log('🎯 Selected tier:', tier)
    setSelectedTier(tier)

    // Route to the appropriate profile creation flow
    switch (tier) {
      case ProfileTier.FREE:
        router.push(ROUTES.AUTH.PROFILE.STEPS.BASIC)
        break
      case ProfileTier.PRO:
        router.push(ROUTES.AUTH.PROFILE.STEPS.PRO)
        break
      case ProfileTier.GROUP:
        router.push(ROUTES.AUTH.PROFILE.STEPS.GROUP)
        break
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Select Your Profile Type</h1>

      <div className='grid md:grid-cols-3 gap-8'>
        {/* Free Tier */}
        <div
          className={`p-6 rounded-lg border-2 ${
            selectedTier === ProfileTier.FREE
              ? 'border-green-500 bg-green-50/10'
              : 'border-gray-700 hover:border-gray-500'
          } cursor-pointer transition-all`}
          onClick={() => handleTierSelect(ProfileTier.FREE)}
        >
          <h2 className='text-xl font-semibold mb-4'>Free Profile</h2>
          <ul className='space-y-2 text-gray-300'>
            <li>• Basic recipe management</li>
            <li>• Personal profile</li>
            <li>• Community access</li>
          </ul>
          <p className='mt-4 text-green-500 font-semibold'>Free</p>
        </div>

        {/* Pro Tier */}
        <div
          className={`p-6 rounded-lg border-2 ${
            selectedTier === ProfileTier.PRO
              ? 'border-blue-500 bg-blue-50/10'
              : 'border-gray-700 hover:border-gray-500'
          } cursor-pointer transition-all`}
          onClick={() => handleTierSelect(ProfileTier.PRO)}
        >
          <h2 className='text-xl font-semibold mb-4'>Professional Profile</h2>
          <ul className='space-y-2 text-gray-300'>
            <li>• Advanced recipe features</li>
            <li>• Professional portfolio</li>
            <li>• Client management</li>
            <li>• Priority support</li>
          </ul>
          <p className='mt-4 text-blue-500 font-semibold'>Professional License Required</p>
        </div>

        {/* Group Tier */}
        <div
          className={`p-6 rounded-lg border-2 ${
            selectedTier === ProfileTier.GROUP
              ? 'border-purple-500 bg-purple-50/10'
              : 'border-gray-700 hover:border-gray-500'
          } cursor-pointer transition-all`}
          onClick={() => handleTierSelect(ProfileTier.GROUP)}
        >
          <h2 className='text-xl font-semibold mb-4'>Group Profile</h2>
          <ul className='space-y-2 text-gray-300'>
            <li>• Team collaboration</li>
            <li>• Organization management</li>
            <li>• Enterprise features</li>
            <li>• Custom branding</li>
            <li>• Dedicated support</li>
          </ul>
          <p className='mt-4 text-purple-500 font-semibold'>Enterprise License Required</p>
        </div>
      </div>

      <div className='mt-8 text-gray-400'>
        <p>
          Select the profile type that best matches your needs. You can upgrade later if needed.
        </p>
      </div>
    </div>
  )
}

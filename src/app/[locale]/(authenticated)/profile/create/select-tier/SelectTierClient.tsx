'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/app/api/routes/routes'
import { ProfileTier } from '../../../profile'

interface SelectTierClientProps {
  userAddress: string
  hasPro: boolean
  hasGroup: boolean
  hasOG: boolean
}

export function SelectTierClient({ userAddress, hasPro, hasGroup, hasOG }: SelectTierClientProps) {
  const router = useRouter()
  const t = useTranslations('profile')
  const [selectedTier, setSelectedTier] = useState<ProfileTier | null>(null)

  const handleTierSelect = (tier: ProfileTier) => {
    // Check if user has the required tier token
    if (tier === ProfileTier.PRO && !hasPro) {
      router.push(ROUTES.AUTH.TIER.PRO)
      return
    }
    if (tier === ProfileTier.GROUP && !hasGroup) {
      router.push(ROUTES.AUTH.TIER.GROUP)
      return
    }
    if (tier === ProfileTier.OG && !hasOG) {
      router.push(ROUTES.AUTH.TIER.OG)
      return
    }

    setSelectedTier(tier)
    router.push(`${ROUTES.AUTH.PROFILE.CREATE}?tier=${tier}`)
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>{t('selectProfileType')}</h1>

      <div className='grid md:grid-cols-4 gap-8'>
        {/* Free Tier */}
        <div
          className={`p-6 rounded-lg border-2 ${
            selectedTier === ProfileTier.FREE
              ? 'border-green-500 bg-green-50/10'
              : 'border-gray-700 hover:border-gray-500'
          } cursor-pointer transition-all`}
          onClick={() => handleTierSelect(ProfileTier.FREE)}
        >
          <h2 className='text-xl font-semibold mb-4'>{t('freeTier.title')}</h2>
          <ul className='space-y-2 text-gray-300'>
            <li>• {t('freeTier.features.basic')}</li>
            <li>• {t('freeTier.features.personal')}</li>
            <li>• {t('freeTier.features.community')}</li>
          </ul>
          <p className='mt-4 text-green-500 font-semibold'>{t('freeTier.price')}</p>
        </div>

        {/* Pro Tier */}
        <div
          className={`p-6 rounded-lg border-2 ${
            selectedTier === ProfileTier.PRO
              ? 'border-blue-500 bg-blue-50/10'
              : 'border-gray-700 hover:border-gray-500'
          } cursor-pointer transition-all ${!hasPro && 'opacity-75'}`}
          onClick={() => handleTierSelect(ProfileTier.PRO)}
        >
          <h2 className='text-xl font-semibold mb-4'>{t('proTier.title')}</h2>
          <ul className='space-y-2 text-gray-300'>
            <li>• {t('proTier.features.advanced')}</li>
            <li>• {t('proTier.features.portfolio')}</li>
            <li>• {t('proTier.features.clients')}</li>
            <li>• {t('proTier.features.support')}</li>
          </ul>
          <p className='mt-4 text-blue-500 font-semibold'>
            {hasPro ? t('proTier.owned') : t('proTier.required')}
          </p>
        </div>

        {/* Group Tier */}
        <div
          className={`p-6 rounded-lg border-2 ${
            selectedTier === ProfileTier.GROUP
              ? 'border-purple-500 bg-purple-50/10'
              : 'border-gray-700 hover:border-gray-500'
          } cursor-pointer transition-all ${!hasGroup && 'opacity-75'}`}
          onClick={() => handleTierSelect(ProfileTier.GROUP)}
        >
          <h2 className='text-xl font-semibold mb-4'>{t('groupTier.title')}</h2>
          <ul className='space-y-2 text-gray-300'>
            <li>• {t('groupTier.features.team')}</li>
            <li>• {t('groupTier.features.organization')}</li>
            <li>• {t('groupTier.features.enterprise')}</li>
            <li>• {t('groupTier.features.branding')}</li>
            <li>• {t('groupTier.features.support')}</li>
          </ul>
          <p className='mt-4 text-purple-500 font-semibold'>
            {hasGroup ? t('groupTier.owned') : t('groupTier.required')}
          </p>
        </div>

        {/* OG Tier */}
        <div
          className={`p-6 rounded-lg border-2 ${
            selectedTier === ProfileTier.OG
              ? 'border-yellow-500 bg-yellow-50/10'
              : 'border-gray-700 hover:border-gray-500'
          } cursor-pointer transition-all ${!hasOG && 'opacity-75'}`}
          onClick={() => handleTierSelect(ProfileTier.OG)}
        >
          <h2 className='text-xl font-semibold mb-4'>{t('ogTier.title')}</h2>
          <ul className='space-y-2 text-gray-300'>
            <li>• {t('ogTier.features.all')}</li>
            <li>• {t('ogTier.features.lifetime')}</li>
            <li>• {t('ogTier.features.exclusive')}</li>
            <li>• {t('ogTier.features.early')}</li>
            <li>• {t('ogTier.features.priority')}</li>
            <li>• {t('ogTier.features.direct')}</li>
            <li>• {t('ogTier.features.limited')}</li>
          </ul>
          <p className='mt-4 text-yellow-500 font-semibold'>
            {hasOG ? t('ogTier.owned') : t('ogTier.required')}
          </p>
        </div>
      </div>

      <div className='mt-8 text-gray-400'>
        <p>{t('tierSelection.help')}</p>
      </div>
    </div>
  )
}

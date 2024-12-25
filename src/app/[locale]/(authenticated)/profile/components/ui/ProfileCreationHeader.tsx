'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ChefHat, Crown, Users, Star } from 'lucide-react'
import { cn } from '@/app/api/utils/utils'
import { Progress } from '@/app/api/components/ui/progress'
import { AutoSaveIndicator } from './AutoSaveIndicator'
import type { NFTTier } from '@/app/[locale]/(authenticated)/tier/hooks/useNFTTiers'

interface ProfileCreationHeaderProps {
  tier: NFTTier
  currentStep: number
  totalSteps: number
  isSaving?: boolean
  lastSaved?: Date | null
  className?: string
}

const tierIcons = {
  free: ChefHat,
  pro: Crown,
  group: Users,
  og: Star,
} as const

const tierColors = {
  free: 'text-blue-500 bg-blue-500/10',
  pro: 'text-purple-500 bg-purple-500/10',
  group: 'text-amber-500 bg-amber-500/10',
  og: 'text-emerald-500 bg-emerald-500/10',
} as const

export function ProfileCreationHeader({
  tier,
  currentStep,
  totalSteps,
  isSaving,
  lastSaved,
  className,
}: ProfileCreationHeaderProps) {
  const t = useTranslations('profile')
  const progress = (currentStep / totalSteps) * 100

  const TierIcon = tierIcons[tier]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Title and Tier Badge */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>{t('creation.welcome.' + tier)}</h1>
          <p className='text-github-fg-muted'>{t('creation.subtitle.' + tier)}</p>
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', tierColors[tier])}
        >
          <TierIcon className='w-5 h-5' />
          <span className='font-medium'>{t(`tier.${tier}`)}</span>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className='space-y-2'>
        <div className='flex justify-between text-sm'>
          <span>{t('creation.progress', { current: currentStep, total: totalSteps })}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className='h-2' />
      </div>

      {/* Auto Save Indicator */}
      {(isSaving !== undefined || lastSaved) && (
        <AutoSaveIndicator isSaving={isSaving || false} lastSaved={lastSaved} />
      )}
    </div>
  )
}

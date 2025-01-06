'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ChefHat, Crown, Users, Star } from 'lucide-react'
import { cn } from '@/app/api/utils/utils'
import { Progress } from '@/app/api/components/ui/progress'
import { AutoSaveIndicator } from './AutoSaveIndicator'
import { ProfileTier as NFTTier, ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { Button } from '@/app/api/components/ui/button'
import { IconEye, IconCurrencyEthereum } from '@/app/api/icons/index'

interface ProfileCreationHeaderProps {
  tier: ProfileTier | keyof typeof ProfileTier
  currentStep: number
  totalSteps: number
  isSaving?: boolean
  lastSaved?: Date | null | undefined
  className?: string
  canMint: boolean
  onShowPreview: () => void
  onCreateBadge: () => void
  isPreviewOpen?: boolean
  isMinting?: boolean
  generationProgress?: {
    stage: string
  }
}

const tierIcons: Record<Lowercase<keyof typeof ProfileTier>, typeof ChefHat> = {
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

// Add helper to convert tier to lowercase with null check
const tierKey = (tier: ProfileTier | keyof typeof ProfileTier) => {
  const tierMap = {
    [ProfileTier.FREE]: 'free',
    [ProfileTier.PRO]: 'pro',
    [ProfileTier.GROUP]: 'group',
    [ProfileTier.OG]: 'og',
  } as const

  return (tierMap[tier as ProfileTier] ?? 'free') as Lowercase<keyof typeof ProfileTier>
}

export function ProfileCreationHeader({
  tier = ProfileTier.FREE,
  currentStep,
  totalSteps,
  isSaving,
  lastSaved,
  className,
  canMint,
  onShowPreview,
  onCreateBadge,
  isPreviewOpen,
  isMinting,
  generationProgress,
  mode,
}: ProfileCreationHeaderProps & { mode: 'create' | 'edit' }) {
  const t = useTranslations('profile')
  const progress = (currentStep / totalSteps) * 100

  const TierIcon = tierIcons[tierKey(tier)]

  return (
    <div className={cn('space-y-6', className)}>
      {/* Title, Tier Badge, and Action Buttons */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t(`creation.welcome.${tierKey(tier)}`)}
          </h1>
          <p className='text-github-fg-muted'>{t(`creation.subtitle.${tierKey(tier)}`)}</p>
        </div>
        <div className='flex items-center gap-4'>
          {/* Action Buttons */}
          <div className='flex gap-2'>
            <Button
              variant='secondary'
              onClick={onShowPreview}
              className='flex items-center gap-2'
              disabled={isPreviewOpen || isMinting}
            >
              <IconEye className='w-4 h-4' />
              Preview
            </Button>
            {mode === 'edit' ? (
              <Button
                onClick={onCreateBadge}
                disabled={!canMint || isMinting}
                className={cn(
                  'flex items-center gap-2 transition-colors',
                  canMint
                    ? 'bg-github-success-emphasis hover:bg-github-success-emphasis/90'
                    : 'bg-github-canvas-subtle'
                )}
              >
                {isMinting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                    {generationProgress?.stage === 'preparing' && 'Updating Profile...'}
                    {generationProgress?.stage === 'capturing' && 'Processing Update...'}
                    {generationProgress?.stage === 'processing' && 'Finalizing Update...'}
                    {!generationProgress && 'Updating Profile...'}
                  </>
                ) : (
                  'Update'
                )}
              </Button>
            ) : (
              <Button
                onClick={onCreateBadge}
                disabled={!canMint || isMinting}
                className={cn(
                  'flex items-center gap-2 transition-colors',
                  canMint
                    ? 'bg-github-success-emphasis hover:bg-github-success-emphasis/90'
                    : 'bg-github-canvas-subtle'
                )}
              >
                {isMinting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                    {generationProgress?.stage === 'preparing' && 'Creating Ownership Badge...'}
                    {generationProgress?.stage === 'capturing' && 'Generating Badge...'}
                    {generationProgress?.stage === 'processing' && 'Storing Verification Data...'}
                    {!generationProgress && 'Minting Ownership Badge...'}
                  </>
                ) : (
                  <>
                    <IconCurrencyEthereum className='w-4 h-4' />
                    Mint
                  </>
                )}
              </Button>
            )}
          </div>
          {/* Tier Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full',
              tierColors[tierKey(tier)]
            )}
          >
            <TierIcon className='w-5 h-5' />
            <span className='font-medium'>{t(`tier.${tierKey(tier)}`)}</span>
          </motion.div>
        </div>
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
        <AutoSaveIndicator isSaving={isSaving || false} lastSaved={lastSaved || null} />
      )}
    </div>
  )
}

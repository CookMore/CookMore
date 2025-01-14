'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ChefHat, Crown, Users, Star } from 'lucide-react'
import { cn } from '@/app/api/utils/utils'
import { Progress } from '@/app/api/components/ui/progress'
import { RecipeAutoSavingIndicator } from './RecipeAutoSavingIndicator'
import { Button } from '@/app/api/components/ui/button'
import { IconEye, IconEdit } from '@/app/api/icons'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { STEPS } from '../steps'
import { useState } from 'react'
import { RecipeMint } from './RecipeMint'

interface RecipeCreationHeaderProps {
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

const tierKey = (tier: ProfileTier | keyof typeof ProfileTier) => {
  const tierMap = {
    [ProfileTier.FREE]: 'free',
    [ProfileTier.PRO]: 'pro',
    [ProfileTier.GROUP]: 'group',
    [ProfileTier.OG]: 'og',
  } as const

  return (tierMap[tier as ProfileTier] ?? 'free') as Lowercase<keyof typeof ProfileTier>
}

export function RecipeCreationHeader({
  tier = ProfileTier.FREE,
  currentStep,
  totalSteps,
  isSaving,
  lastSaved,
  canMint,
  onShowPreview,
  isPreviewOpen,
  isMinting,
  generationProgress,
}: RecipeCreationHeaderProps) {
  const t = useTranslations('recipe')
  const progress = (currentStep / totalSteps) * 100
  const [isMintDialogOpen, setIsMintDialogOpen] = useState(false)

  const handleMintComplete = async () => {
    console.log('Minting complete')
    setIsMintDialogOpen(false)
  }

  const TierIcon = tierIcons[tierKey(tier)]

  // Determine the current step ID based on the currentStep index
  const currentStepId = STEPS[currentStep - 1]?.id || 'title-description'

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t(`steps.${currentStepId}.title`, { default: 'Step Title' })}
          </h1>
          <p className='text-github-fg-muted'>
            {t(`steps.${currentStepId}.description`, { default: 'Step Description' })}
          </p>
          {isSaving && <RecipeAutoSavingIndicator />}
          {lastSaved && (
            <span className='text-xs text-github-fg-muted'>
              {t('lastSaved')}: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className='flex items-center gap-4'>
          <Button
            variant='secondary'
            onClick={onShowPreview}
            className='flex items-center gap-2'
            disabled={isPreviewOpen || isMinting}
          >
            <IconEye className='w-4 h-4' />
            {t('preview')}
          </Button>
          <Button
            variant='primary'
            onClick={() => setIsMintDialogOpen(true)}
            disabled={!canMint || isMinting}
          >
            {t('mint')}
          </Button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full',
              tierColors[tierKey(tier)]
            )}
          >
            <TierIcon className='w-5 h-5' />
            <span className='font-medium'>{tierKey(tier)}</span>
          </motion.div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <Progress value={progress} />
        <span className='text-sm text-github-fg-muted'>{progress.toFixed(0)}%</span>
      </div>
      <RecipeMint
        isOpen={isMintDialogOpen}
        onClose={() => setIsMintDialogOpen(false)}
        formData={
          {
            /* Pass necessary form data */
          }
        }
        onComplete={handleMintComplete}
        canMint={canMint}
      />
    </div>
  )
}

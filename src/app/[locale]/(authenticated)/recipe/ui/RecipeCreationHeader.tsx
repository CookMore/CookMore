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
import { useState, useEffect } from 'react'
import { RecipeMint } from './RecipeMint'
import { useAuth } from '@/app/api/auth/hooks/useAuth'
import { getProfile } from '@/app/[locale]/(authenticated)/profile/services/server/profile.service'
import { ethers } from 'ethers'
import { profileABI } from '@/app/api/blockchain/abis/profile'

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
  const [profileId, setProfileId] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    async function fetchProfileData() {
      if (user?.wallet?.address) {
        try {
          const sepoliaProvider = new ethers.providers.JsonRpcProvider(
            process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
          )
          const contract = new ethers.Contract(
            '0x0C3897538e000dAdAEA1bb10D5757fC473972018',
            profileABI,
            sepoliaProvider
          )

          const profile = await contract.getProfile(user.wallet.address.toLowerCase())
          const profileId = profile.profileId
          console.log('Profile ID:', profileId.toString())

          setProfileId(profileId.toString())
        } catch (error) {
          console.error('Failed to fetch profile data:', error)
        }
      }
    }

    fetchProfileData()
  }, [user])

  const handleMintComplete = async () => {
    console.log('Minting complete')
    setIsMintDialogOpen(false)
  }

  const TierIcon = tierIcons[tierKey(tier)]

  // Determine the current step ID based on the currentStep index
  const currentStepId = STEPS[currentStep - 1]?.id || 'title-description'

  return (
    <div className='space-y-6 border border-gray-300 p-4'>
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
            variant='default'
            onClick={() => setIsMintDialogOpen(true)}
            disabled={!canMint || isMinting}
          >
            {t('mint')}
          </Button>
          <div className={cn('flex items-center gap-4', tierColors[tierKey(tier)])}>
            <span className='text-xs text-github-fg-muted'>Tier</span>
            <TierIcon className='w-5 h-5' />
            <span className='font-medium'>{tierKey(tier)}</span>
            {profileId && (
              <>
                <span className='text-xs text-github-fg-muted ml-4'>Profile ID</span>
                <span className='text-sm text-github-fg-muted font-bold'>ID: {profileId}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <Progress value={progress} />
        <span className='text-md text-github-fg-muted'>{progress.toFixed(0)}%</span>
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

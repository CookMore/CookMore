'use client'

// React and hooks
import { useState } from 'react'

// Custom hooks
import { useNFTTiers } from '@/hooks/useNFTTiers'
import { useTierMint } from '@/lib/web3/hooks/useTierMint'
import { useProfile } from '@/app/providers/ProfileProvider'
import { toast } from 'sonner'

// Components
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Types
import { ProfileTier } from '@/types/profile'

interface ProfileTypeSwitcherProps {
  hasPro: boolean
  hasGroup: boolean
}

export function ProfileTypeSwitcher({ hasPro, hasGroup }: ProfileTypeSwitcherProps) {
  const { mint, isLoading } = useTierMint(() => {
    toast.success('Successfully minted NFT')
  })

  const handleProMint = async () => {
    try {
      await mint('Pro')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to mint Pro NFT')
    }
  }

  const handleGroupMint = async () => {
    try {
      await mint('Group')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to mint Group NFT')
    }
  }

  return (
    <div className='flex space-x-4 mb-6'>
      {!hasPro && !hasGroup && (
        <Button onClick={handleProMint} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Mint Pro NFT'}
        </Button>
      )}

      {!hasGroup && (
        <Button onClick={handleGroupMint} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Mint Group NFT'}
        </Button>
      )}
    </div>
  )
}

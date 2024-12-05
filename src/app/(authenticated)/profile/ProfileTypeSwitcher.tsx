'use client'

import { useState } from 'react'
import { useNFTTiers } from '@/hooks/useNFTTiers'
import { useTierContract } from '@/hooks/useTierContract'
import { useProfile } from '@/hooks/useProfile'
import { ProfileTier } from '@/types/profile'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useToast } from '@/hooks/use-toast'

export function ProfileTypeSwitcher() {
  const { hasPro, hasGroup } = useNFTTiers()
  const { mintPro, mintGroup, upgradeToGroup } = useTierContract()
  const { currentTier } = useProfile()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleMintPro = async () => {
    try {
      setIsLoading(true)
      await mintPro()
      toast({
        title: 'Success',
        description: 'Successfully minted Pro NFT',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to mint Pro NFT',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMintGroup = async () => {
    try {
      setIsLoading(true)
      await mintGroup()
      toast({
        title: 'Success',
        description: 'Successfully minted Group NFT',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to mint Group NFT',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgradeToGroup = async () => {
    try {
      setIsLoading(true)
      await upgradeToGroup()
      toast({
        title: 'Success',
        description: 'Successfully upgraded to Group tier',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upgrade to Group tier',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex space-x-4 mb-6'>
      {!hasPro && !hasGroup && (
        <Button onClick={handleMintPro} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Mint Pro NFT'}
        </Button>
      )}

      {hasPro && !hasGroup && (
        <Button onClick={handleUpgradeToGroup} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Upgrade to Group'}
        </Button>
      )}

      {!hasGroup && (
        <Button onClick={handleMintGroup} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Mint Group NFT'}
        </Button>
      )}
    </div>
  )
}

'use client'

import { useTierMint } from '@/app/[locale]/(authenticated)/tier/hooks/useTierMint'
import { toast } from 'sonner'
import { Button } from '@/app/api/components/ui/button'
import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'

interface ProfileTypeSwitcherProps {
  hasPro: boolean
  hasGroup: boolean
  hasOG: boolean
}

export function ProfileTypeSwitcher({ hasPro, hasGroup, hasOG }: ProfileTypeSwitcherProps) {
  const { mintTier, isLoading } = useTierMint(() => {
    toast.success('Successfully minted NFT')
  })

  const handleOGMint = async () => {
    try {
      await mintTier('OG')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to mint OG NFT')
    }
  }

  const handleProMint = async () => {
    try {
      await mintTier('Pro')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to mint Pro NFT')
    }
  }

  const handleGroupMint = async () => {
    try {
      await mintTier('Group')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to mint Group NFT')
    }
  }

  return (
    <div className='flex space-x-4 mb-6'>
      {!hasOG && !hasPro && !hasGroup && (
        <Button onClick={handleOGMint} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Mint OG NFT'}
        </Button>
      )}
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

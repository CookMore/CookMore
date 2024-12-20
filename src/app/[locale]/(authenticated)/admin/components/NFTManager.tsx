'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/app/api/components/ui/button'
import { FormInput } from '@/app/api/form/FormInput'
import { toast } from 'sonner'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { getContracts } from '@/app/api/blockchain/server/getContracts'
import { useWalletClient } from 'wagmi'
import { cn } from '@/app/api/utils/utils'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'

interface NFTAddresses {
  proNFT: string
  groupNFT: string
}

function NFTManagerSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-10 w-full bg-github-canvas-subtle animate-pulse rounded' />
      <div className='h-9 w-32 bg-github-canvas-subtle animate-pulse rounded' />
    </div>
  )
}

export default function NFTManager() {
  const { profile } = useProfile()
  const [baseURI, setBaseURI] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [addresses, setAddresses] = useState<NFTAddresses | null>(null)
  const { theme } = useTheme()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    if (profile?.owner) {
      hasRequiredRole(profile.owner, ROLES.ADMIN).then(setHasAccess)
    }
  }, [profile?.owner])

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { tierContract } = await getContracts()
        setAddresses({
          proNFT: tierContract.address,
          groupNFT: tierContract.address, // Update this when group NFT is separate
        })
      } catch (error) {
        console.error('Error fetching NFT addresses:', error)
        toast.error('Failed to fetch NFT addresses')
      }
    }

    fetchAddresses()
  }, [])

  // Role check
  if (!hasAccess) {
    return null
  }

  const handleUpdateBaseURI = async () => {
    try {
      setLoading(true)
      const { tierContract } = await getContracts()

      if (!walletClient) {
        throw new Error('No wallet found')
      }

      const [account] = await walletClient.requestAddresses()

      const hash = await walletClient.writeContract({
        address: tierContract.address,
        abi: tierContract.abi,
        functionName: 'setBaseURI',
        args: [baseURI],
        account,
      })

      toast.success(`Base URI update submitted: ${hash}`)
      setBaseURI('')
    } catch (error) {
      console.error('Error updating base URI:', error)
      toast.error('Failed to update base URI')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Suspense fallback={<NFTManagerSkeleton />}>
      <div
        className={cn(
          'p-4 rounded-lg',
          'bg-github-canvas-default',
          'border border-github-border-default',
          theme === 'neo' && 'neo-border neo-shadow'
        )}
      >
        <h2
          className={cn(
            'text-xl font-semibold mb-4',
            'text-github-fg-default',
            theme === 'neo' && 'font-mono tracking-tight'
          )}
        >
          NFT Management
        </h2>
        <div className='space-y-4'>
          <div
            className={cn(
              'p-3 rounded-md',
              'bg-github-canvas-subtle',
              theme === 'neo' && 'neo-border'
            )}
          >
            <h4
              className={cn(
                'text-sm font-medium mb-2',
                'text-github-fg-default',
                theme === 'neo' && 'font-mono'
              )}
            >
              Contract Addresses
            </h4>
            <div
              className={cn(
                'text-xs text-github-fg-muted space-y-1',
                theme === 'neo' && 'font-mono'
              )}
            >
              <p>Pro NFT: {addresses?.proNFT || 'Loading...'}</p>
              <p>Group NFT: {addresses?.groupNFT || 'Loading...'}</p>
            </div>
          </div>

          <FormInput
            name='baseURI'
            label='Base URI'
            value={baseURI}
            onChange={(e) => setBaseURI(e.target.value)}
            placeholder='ipfs://'
            disabled={loading}
            theme={theme}
          />

          <div className='flex gap-4'>
            <Button
              onClick={handleUpdateBaseURI}
              disabled={loading || !baseURI}
              variant='default'
              className={cn('text-sm gap-2', theme === 'neo' && 'neo-button')}
            >
              {loading ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-github-accent-emphasis' />
              ) : (
                'Update Base URI'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

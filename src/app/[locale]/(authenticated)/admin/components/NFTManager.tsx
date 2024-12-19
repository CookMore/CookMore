'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/app/api/components/ui/button'
import { FormInput } from '@/app/api/form/FormInput'
import { toast } from 'sonner'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfile'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { getContracts } from '@/app/api/blockchain/server/getContracts'
import { createWalletClient, custom } from 'viem'
import { baseSepolia, base } from 'viem/chains'

interface NFTAddresses {
  proNFT: string
  groupNFT: string
}

function NFTManagerSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <div className='h-5 w-32 bg-github-canvas-subtle animate-pulse rounded' />
        <div className='space-y-1'>
          <div className='h-4 w-64 bg-github-fg-muted/20 rounded' />
          <div className='h-4 w-64 bg-github-fg-muted/20 rounded' />
        </div>
      </div>
      <div className='h-10 w-full bg-github-canvas-subtle animate-pulse rounded' />
      <div className='h-9 w-32 bg-github-canvas-subtle animate-pulse rounded' />
    </div>
  )
}

export function NFTManager() {
  const { profile } = useProfile()
  const [baseURI, setBaseURI] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [addresses, setAddresses] = useState<NFTAddresses | null>(null)

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

      if (!window.ethereum) {
        throw new Error('No wallet found')
      }

      const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia
      const walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      })

      const [address] = await walletClient.requestAddresses()

      const hash = await walletClient.writeContract({
        address: tierContract.address,
        abi: tierContract.abi,
        functionName: 'setBaseURI',
        args: [baseURI],
        account: address,
      })

      toast.success(`Base URI update submitted: ${hash}`)
    } catch (error) {
      console.error('Error updating base URI:', error)
      toast.error('Failed to update base URI')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Suspense fallback={<NFTManagerSkeleton />}>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <h4 className='text-sm font-medium'>Contract Addresses</h4>
          <div className='text-xs text-github-fg-muted space-y-1'>
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
        />

        <div className='flex gap-4'>
          <Button onClick={handleUpdateBaseURI} disabled={loading || !baseURI} className='text-sm'>
            {loading ? (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-github-accent-emphasis' />
            ) : (
              'Update Base URI'
            )}
          </Button>
        </div>
      </div>
    </Suspense>
  )
}

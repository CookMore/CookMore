'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/app/api/components/ui/button'
import { FormInput } from '@/app/api/form/FormInput'
import { toast } from 'sonner'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfile'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { getContracts } from '@/app/api/blockchain/server/getContracts'
import { createWalletClient, createPublicClient, custom, http } from 'viem'
import { baseSepolia, base } from 'viem/chains'

function RoleManagerSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-10 w-full bg-github-canvas-subtle animate-pulse rounded' />
      <div className='flex gap-4'>
        <div className='h-9 w-24 bg-github-canvas-subtle animate-pulse rounded' />
        <div className='h-9 w-24 bg-github-canvas-subtle animate-pulse rounded' />
        <div className='h-9 w-24 bg-github-canvas-subtle animate-pulse rounded' />
      </div>
    </div>
  )
}

export function RoleManager() {
  const { profile } = useProfile()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (profile?.owner) {
      hasRequiredRole(profile.owner, ROLES.ADMIN).then(setHasAccess)
    }
  }, [profile?.owner])

  // Role check
  if (!hasAccess) {
    return null
  }

  const handleGrantRole = async () => {
    try {
      setLoading(true)
      const { accessControlContract } = await getContracts()

      if (!window.ethereum) {
        throw new Error('No wallet found')
      }

      const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia
      const walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      })

      const [account] = await walletClient.requestAddresses()

      const hash = await walletClient.writeContract({
        address: accessControlContract.address,
        abi: accessControlContract.abi,
        functionName: 'grantRole',
        args: [ROLES.METADATA_MANAGER, address],
        account,
      })

      toast.success('Role granted successfully', {
        description: `Transaction hash: ${hash}`,
      })
      setAddress('')
    } catch (error) {
      console.error('Error granting role:', error)
      toast.error('Failed to grant role')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeRole = async () => {
    try {
      setLoading(true)
      const { accessControlContract } = await getContracts()

      if (!window.ethereum) {
        throw new Error('No wallet found')
      }

      const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia
      const walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      })

      const [account] = await walletClient.requestAddresses()

      const hash = await walletClient.writeContract({
        address: accessControlContract.address,
        abi: accessControlContract.abi,
        functionName: 'revokeRole',
        args: [ROLES.METADATA_MANAGER, address],
        account,
      })

      toast.success('Role revoked successfully', {
        description: `Transaction hash: ${hash}`,
      })
      setAddress('')
    } catch (error) {
      console.error('Error revoking role:', error)
      toast.error('Failed to revoke role')
    } finally {
      setLoading(false)
    }
  }

  const checkRole = async () => {
    try {
      const { accessControlContract } = await getContracts()
      const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      })

      const hasRole = await publicClient.readContract({
        address: accessControlContract.address,
        abi: accessControlContract.abi,
        functionName: 'hasRole',
        args: [ROLES.METADATA_MANAGER, address],
      })

      toast.info(
        hasRole ? 'Address has Feature Manager role' : 'Address does not have Feature Manager role'
      )
    } catch (error) {
      console.error('Error checking role:', error)
      toast.error('Failed to check role')
    }
  }

  return (
    <Suspense fallback={<RoleManagerSkeleton />}>
      <div className='space-y-4'>
        <FormInput
          name='address'
          label='Wallet Address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='0x...'
          disabled={loading}
        />
        <div className='flex gap-4'>
          <Button onClick={handleGrantRole} disabled={loading || !address} className='text-sm'>
            {loading ? (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-github-accent-emphasis' />
            ) : (
              'Grant Role'
            )}
          </Button>
          <Button
            onClick={handleRevokeRole}
            disabled={loading || !address}
            variant='destructive'
            className='text-sm'
          >
            {loading ? (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-github-accent-emphasis' />
            ) : (
              'Revoke Role'
            )}
          </Button>
          <Button onClick={checkRole} disabled={!address} variant='outline' className='text-sm'>
            Check Role
          </Button>
        </div>
      </div>
    </Suspense>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/app/api/components/ui/button'
import { FormInput } from '@/app/api/form/FormInput'
import { toast } from 'sonner'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { cn } from '@/app/api/utils/utils'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import { getContracts } from '@/app/api/blockchain/server/getContracts'
import { useWalletClient, usePublicClient } from 'wagmi'

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

export default function RoleManager() {
  const { profile } = useProfile()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const { theme } = useTheme()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  useEffect(() => {
    let mounted = true

    async function checkAccess() {
      if (profile?.owner) {
        const result = await hasRequiredRole(profile.owner, ROLES.ADMIN)
        if (mounted) {
          setHasAccess(result)
        }
      }
    }

    checkAccess()

    return () => {
      mounted = false
    }
  }, [profile?.owner])

  // Role check
  if (!hasAccess) {
    return null
  }

  const handleGrantRole = async () => {
    if (!address || loading) return

    try {
      setLoading(true)
      const { accessControlContract } = await getContracts()

      if (!walletClient) {
        throw new Error('No wallet found')
      }

      const [account] = await walletClient.requestAddresses()

      const hash = await walletClient.writeContract({
        address: accessControlContract.address,
        abi: accessControlContract.abi,
        functionName: 'grantRole',
        args: [ROLES.METADATA_MANAGER, address],
        account,
      })

      toast.success('Role granted successfully')
      setAddress('')
    } catch (error) {
      console.error('Error granting role:', error)
      toast.error('Failed to grant role')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeRole = async () => {
    if (!address || loading) return

    try {
      setLoading(true)
      const { accessControlContract } = await getContracts()

      if (!walletClient) {
        throw new Error('No wallet found')
      }

      const [account] = await walletClient.requestAddresses()

      const hash = await walletClient.writeContract({
        address: accessControlContract.address,
        abi: accessControlContract.abi,
        functionName: 'revokeRole',
        args: [ROLES.METADATA_MANAGER, address],
        account,
      })

      toast.success('Role revoked successfully')
      setAddress('')
    } catch (error) {
      console.error('Error revoking role:', error)
      toast.error('Failed to revoke role')
    } finally {
      setLoading(false)
    }
  }

  const checkRole = async () => {
    if (!address) return

    try {
      const { accessControlContract } = await getContracts()

      if (!publicClient) {
        throw new Error('Public client not available')
      }

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
          Role Management
        </h2>
        <div className='space-y-4'>
          <FormInput
            name='address'
            label='Wallet Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='0x...'
            disabled={loading}
            theme={theme}
          />
          <div className='flex gap-4'>
            <Button
              onClick={handleGrantRole}
              disabled={loading || !address}
              variant='default'
              className={cn('text-sm gap-2', theme === 'neo' && 'neo-button')}
            >
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
              className={cn('text-sm gap-2', theme === 'neo' && 'neo-button')}
            >
              {loading ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-github-accent-emphasis' />
              ) : (
                'Revoke Role'
              )}
            </Button>
            <Button
              onClick={checkRole}
              disabled={!address}
              variant='outline'
              className={cn('text-sm gap-2', theme === 'neo' && 'neo-button')}
            >
              Check Role
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

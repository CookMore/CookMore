'use client'

import { useState, useEffect } from 'react'
import { useAccessControl } from '@/hooks/useAccessControl'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/FormInput'
import { useToast } from '@/components/ui/use-toast'
import { useWalletClient } from 'wagmi'

export function RoleManager() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const { grantRole, revokeRole, hasRole, ROLES } = useAccessControl()
  const { data: walletClient } = useWalletClient()
  const { toast } = useToast()

  useEffect(() => {
    if (walletClient) {
      setIsReady(true)
    }
  }, [walletClient])

  const handleGrantRole = async () => {
    if (!isReady) return
    try {
      setLoading(true)
      await grantRole(ROLES.METADATA_MANAGER, address)
      toast({
        title: 'Role Granted',
        description: 'Successfully granted Feature Manager role',
      })
      setAddress('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to grant role',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeRole = async () => {
    if (!isReady) return
    try {
      setLoading(true)
      await revokeRole(ROLES.METADATA_MANAGER, address)
      toast({
        title: 'Role Revoked',
        description: 'Successfully revoked Feature Manager role',
      })
      setAddress('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke role',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const checkRole = async () => {
    if (!isReady || !address) return
    const hasManagerRole = await hasRole(ROLES.METADATA_MANAGER, address)
    toast({
      title: 'Role Status',
      description: hasManagerRole
        ? 'Address has Feature Manager role'
        : 'Address does not have Feature Manager role',
    })
  }

  if (!isReady) {
    return (
      <div className='space-y-4 opacity-50'>
        <FormInput label='Wallet Address' value='' disabled placeholder='Loading...' />
        <div className='flex gap-4'>
          <Button disabled>Grant Role</Button>
          <Button disabled variant='destructive'>
            Revoke Role
          </Button>
          <Button disabled variant='outline'>
            Check Role
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <FormInput
        label='Wallet Address'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder='0x...'
      />

      <div className='flex gap-4'>
        <Button onClick={handleGrantRole} disabled={loading || !address}>
          Grant Role
        </Button>

        <Button onClick={handleRevokeRole} disabled={loading || !address} variant='destructive'>
          Revoke Role
        </Button>

        <Button onClick={checkRole} disabled={!address} variant='outline'>
          Check Role
        </Button>
      </div>
    </div>
  )
}

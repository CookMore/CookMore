'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/app/api/components/ui/button'
import { toast } from 'sonner'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { baseSepolia, base } from 'viem/chains'
import { getContracts } from '@/app/api/blockchain/server/getContracts'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/useProfile'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'

interface DeletedProfile {
  wallet: string
  profileId: string
  timestamp: number
}

function DeletedProfilesSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='h-7 w-40 bg-github-canvas-subtle animate-pulse rounded' />
        <div className='h-9 w-24 bg-github-canvas-subtle animate-pulse rounded' />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className='p-3 bg-github-canvas-subtle rounded-md animate-pulse'>
          <div className='h-5 w-3/4 bg-github-fg-muted/20 rounded mb-2' />
          <div className='h-4 w-1/2 bg-github-fg-muted/20 rounded' />
        </div>
      ))}
    </div>
  )
}

export function DeletedProfiles() {
  const { profile } = useProfile()
  const [deletedProfiles, setDeletedProfiles] = useState<DeletedProfile[]>([])
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

  // Listen for ProfileDeleted events
  useEffect(() => {
    const fetchDeletedProfiles = async () => {
      try {
        setLoading(true)
        const contracts = await getContracts()
        const profileContract = contracts.profileContract

        const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia
        const client = createPublicClient({
          chain,
          transport: http(),
        })

        // Get current block number
        const currentBlock = await client.getBlockNumber()
        // Look back ~1 day worth of blocks (assuming ~12s block time)
        const fromBlock = currentBlock - 7200n

        // Get past deletion events
        const logs = await client.getLogs({
          address: profileContract.address,
          event: parseAbiItem('event ProfileDeleted(address wallet, uint256 profileId)'),
          fromBlock,
        })

        const profiles = await Promise.all(
          logs.map(async (log) => {
            const block = await client.getBlock({ blockHash: log.blockHash })
            return {
              wallet: log.args?.wallet as string,
              profileId: (log.args?.profileId as bigint).toString(),
              timestamp: Number(block.timestamp) * 1000, // Convert to milliseconds
            }
          })
        )

        setDeletedProfiles(profiles)
      } catch (error) {
        console.error('Error fetching deleted profiles:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch deleted profiles'
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchDeletedProfiles()

    // Initialize event listening
    const initializeEventListener = async () => {
      try {
        const client = createPublicClient({
          chain: baseSepolia,
          transport: http(),
        })

        const unwatch = client.watchEvent({
          event: parseAbiItem('event ProfileDeleted(address wallet, uint256 profileId)'),
          onLogs: async (logs) => {
            for (const log of logs) {
              const block = await client.getBlock({ blockHash: log.blockHash })
              setDeletedProfiles((prev) => [
                ...prev,
                {
                  wallet: log.args?.wallet as string,
                  profileId: (log.args?.profileId as bigint).toString(),
                  timestamp: Number(block.timestamp) * 1000,
                },
              ])
            }
          },
        })

        return unwatch
      } catch (error) {
        console.error('Error setting up event listener:', error)
      }
    }

    const cleanup = initializeEventListener()
    return () => {
      if (cleanup) cleanup.then((unwatch) => unwatch?.())
    }
  }, [])

  return (
    <Suspense fallback={<DeletedProfilesSkeleton />}>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-medium'>Deleted Profiles</h3>
          <Button
            variant='outline'
            className='text-sm'
            onClick={() => setDeletedProfiles([])}
            disabled={deletedProfiles.length === 0 || loading}
          >
            Clear List
          </Button>
        </div>

        {loading ? (
          <div className='text-center py-4'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-accent-emphasis mx-auto' />
          </div>
        ) : deletedProfiles.length === 0 ? (
          <p className='text-sm text-github-fg-muted text-center py-4'>No deleted profiles found</p>
        ) : (
          <div className='space-y-2'>
            {deletedProfiles.map((profile) => (
              <div
                key={`${profile.wallet}-${profile.profileId}`}
                className='p-3 bg-github-canvas-subtle rounded-md'
              >
                <div className='text-sm font-medium'>{profile.wallet}</div>
                <div className='text-xs text-github-fg-muted'>
                  Profile ID: {profile.profileId}
                  <br />
                  Deleted: {new Date(profile.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  )
}

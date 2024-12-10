'use client'

import { useState, useEffect } from 'react'
import { useProfileRegistry } from '@/lib/web3/hooks/useProfileRegistry'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ethers } from 'ethers'
import { PROFILE_REGISTRY_ABI, PROFILE_REGISTRY_ADDRESS } from '@/lib/web3/abis/ProfileRegistry'
import type { Log, EventLog } from 'ethers'

interface DeletedProfile {
  wallet: string
  profileId: string
  timestamp: number
}

export function DeletedProfiles() {
  const [deletedProfiles, setDeletedProfiles] = useState<DeletedProfile[]>([])
  const [loading, setLoading] = useState(false)

  const handleError = (error: any) => {
    const errorMessage = error?.message || 'An error occurred'
    toast.error('Error', {
      description: errorMessage,
    })
  }

  // Listen for ProfileDeleted events
  useEffect(() => {
    const fetchDeletedProfiles = async () => {
      try {
        setLoading(true)

        // Initialize ethers contract
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(
          PROFILE_REGISTRY_ADDRESS,
          PROFILE_REGISTRY_ABI,
          provider
        )

        // Get current block number
        const currentBlock = await provider.getBlockNumber()
        // Look back ~1 day worth of blocks (assuming ~12s block time)
        const fromBlock = Math.max(0, currentBlock - 7200)

        // Get past deletion events
        const filter = contract.filters.ProfileDeleted()
        const events = await contract.queryFilter(filter, fromBlock)

        const profiles = await Promise.all(
          events.map(async (event) => {
            const block = await event.getBlock()
            return {
              wallet: (event as EventLog).args?.[0] as string,
              profileId: ((event as EventLog).args?.[1] as bigint).toString(),
              timestamp: block.timestamp * 1000, // Convert to milliseconds
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

    // Initialize contract for event listening
    const initializeEventListener = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(
          PROFILE_REGISTRY_ADDRESS,
          PROFILE_REGISTRY_ABI,
          provider
        )

        // Listen for new deletion events
        const handleProfileDeleted = async (wallet: string, profileId: bigint, event: EventLog) => {
          const block = await event.getBlock()
          setDeletedProfiles((prev) => [
            ...prev,
            {
              wallet,
              profileId: profileId.toString(),
              timestamp: block.timestamp * 1000,
            },
          ])
        }

        contract.on('ProfileDeleted', handleProfileDeleted)

        // Cleanup function
        return () => {
          contract.off('ProfileDeleted', handleProfileDeleted)
        }
      } catch (error) {
        console.error('Error setting up event listener:', error)
      }
    }

    const cleanup = initializeEventListener()
    return () => {
      cleanup.then((cleanupFn) => cleanupFn?.())
    }
  }, [toast])

  return (
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
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-accent-emphasis mx-auto'></div>
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
  )
}

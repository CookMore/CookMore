import { useState, useCallback, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { useAccount } from 'wagmi'
import type { ProfileTier } from '../../../profile'
import { TIER_CONTRACT_ABI, TIER_CONTRACT_ADDRESS } from '../config/contracts'

interface TierStatus {
  hasFree: boolean
  hasPro: boolean
  hasGroup: boolean
  hasOG: boolean
  currentTier: ProfileTier
}

interface UseProfileTier {
  isLoading: boolean
  error: string | null
  tierStatus: TierStatus | null
  checkTierAccess: (tier: ProfileTier) => Promise<boolean>
  getCurrentTier: () => Promise<ProfileTier>
  canUpgradeTier: (targetTier: ProfileTier) => Promise<boolean>
}

export function useProfileTier(): UseProfileTier {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tierStatus, setTierStatus] = useState<TierStatus | null>(null)

  // Contract read hooks
  const { data: tierData, refetch: refetchTier } = useContractRead({
    address: TIER_CONTRACT_ADDRESS,
    abi: TIER_CONTRACT_ABI,
    functionName: 'getTierStatus',
    args: [address],
  })

  // Update tier status when data changes
  useEffect(() => {
    if (tierData) {
      const [hasFree, hasPro, hasGroup, hasOG, currentTier] = tierData
      setTierStatus({
        hasFree,
        hasPro,
        hasGroup,
        hasOG,
        currentTier,
      })
    }
  }, [tierData])

  const checkTierAccess = useCallback(
    async (tier: ProfileTier): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        if (!address) {
          throw new Error('No wallet connected')
        }

        const result = await refetchTier()
        if (!result.data) {
          return false
        }

        const [hasFree, hasPro, hasGroup, hasOG] = result.data
        switch (tier) {
          case 0: // FREE
            return hasFree
          case 1: // PRO
            return hasPro
          case 2: // GROUP
            return hasGroup
          case 3: // OG
            return hasOG
          default:
            return false
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to check tier access'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [address, refetchTier]
  )

  const getCurrentTier = useCallback(async (): Promise<ProfileTier> => {
    setIsLoading(true)
    setError(null)

    try {
      if (!address) {
        throw new Error('No wallet connected')
      }

      const result = await refetchTier()
      if (!result.data) {
        return 0 // Default to FREE tier
      }

      const [, , , , currentTier] = result.data
      return currentTier
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get current tier'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [address, refetchTier])

  const canUpgradeTier = useCallback(
    async (targetTier: ProfileTier): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        if (!address) {
          throw new Error('No wallet connected')
        }

        const currentTier = await getCurrentTier()

        // Cannot downgrade
        if (targetTier <= currentTier) {
          return false
        }

        // Check if the target tier is the next available tier
        const result = await refetchTier()
        if (!result.data) {
          return false
        }

        const [hasFree, hasPro, hasGroup, hasOG] = result.data

        // Check upgrade path
        switch (currentTier) {
          case 0: // FREE
            return targetTier === 1 && !hasPro // Can only upgrade to PRO
          case 1: // PRO
            return targetTier === 2 && !hasGroup // Can only upgrade to GROUP
          case 2: // GROUP
            return targetTier === 3 && !hasOG // Can only upgrade to OG
          default:
            return false
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to check upgrade eligibility'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [address, getCurrentTier, refetchTier]
  )

  return {
    isLoading,
    error,
    tierStatus,
    checkTierAccess,
    getCurrentTier,
    canUpgradeTier,
  }
}

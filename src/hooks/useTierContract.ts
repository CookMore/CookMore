import { useContract } from '@/hooks/useContract'
import { TIER_CONTRACT_ADDRESS, TIER_CONTRACT_ABI } from '@/lib/web3/contracts'
import { usePrivy } from '@privy-io/react-auth'
import { ProfileTier } from '@/types/profile'
import { type Address } from 'viem'

export function useTierContract() {
  const { user } = usePrivy()
  const walletAddress = user?.wallet?.address as Address | undefined

  const tierContract = useContract(TIER_CONTRACT_ADDRESS, TIER_CONTRACT_ABI)

  const checkTier = async (): Promise<ProfileTier> => {
    if (!walletAddress || !tierContract) return ProfileTier.FREE

    try {
      // Check if user has any tokens
      const balance = await tierContract.balanceOf(walletAddress)

      if (balance === 0n) return ProfileTier.FREE

      // Get the token ID for the user's first token
      const tokenId = await tierContract.ownerOf(walletAddress)

      // Check if it's a group tier
      const isGroup = await tierContract.isGroupTier(tokenId)

      return isGroup ? ProfileTier.GROUP : ProfileTier.PRO
    } catch (error) {
      console.error('Error checking tier:', error)
      return ProfileTier.FREE
    }
  }

  const mintTier = async (tier: ProfileTier.PRO | ProfileTier.GROUP) => {
    if (!walletAddress || !tierContract) {
      throw new Error('No wallet connected or contract not initialized')
    }

    const method = tier === ProfileTier.GROUP ? 'mintGroup' : 'mintPro'
    const tx = await tierContract[method]()
    return await tx.wait()
  }

  return {
    checkTier,
    mintTier,
    contract: tierContract,
  }
}

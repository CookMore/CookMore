import { publicClient } from './client'
import { CONTRACT_ADDRESSES } from './addresses'
import { PROFILE_REGISTRY_ABI } from './abis/ProfileRegistry'

// Direct contract calls
export const profileRegistry = {
  // Read functions
  async getProfile(address: `0x${string}`) {
    return publicClient.readContract({
      address: CONTRACT_ADDRESSES.PROFILE_REGISTRY,
      abi: PROFILE_REGISTRY_ABI,
      functionName: 'getProfile',
      args: [address],
    })
  },

  // Write functions
  async createProfile(metadataURI: string) {
    return publicClient.writeContract({
      address: CONTRACT_ADDRESSES.PROFILE_REGISTRY,
      abi: PROFILE_REGISTRY_ABI,
      functionName: 'createProfile',
      args: [metadataURI],
    })
  },

  async deleteProfile() {
    return publicClient.writeContract({
      address: CONTRACT_ADDRESSES.PROFILE_REGISTRY,
      abi: PROFILE_REGISTRY_ABI,
      functionName: 'deleteProfile',
    })
  },

  // Admin functions
  async pause() {
    return publicClient.writeContract({
      address: CONTRACT_ADDRESSES.PROFILE_REGISTRY,
      abi: PROFILE_REGISTRY_ABI,
      functionName: 'pause',
    })
  },

  async unpause() {
    return publicClient.writeContract({
      address: CONTRACT_ADDRESSES.PROFILE_REGISTRY,
      abi: PROFILE_REGISTRY_ABI,
      functionName: 'unpause',
    })
  },
}

// Hook for reactive components
export function useProfileRegistry() {
  const { address } = useAccount()

  // Read profile data
  const { data: profile, ...profileQuery } = useContractRead({
    address: CONTRACT_ADDRESSES.PROFILE_REGISTRY,
    abi: PROFILE_REGISTRY_ABI,
    functionName: 'getProfile',
    args: [address!],
    enabled: !!address,
  })

  // Write operations
  const { writeAsync: createProfile, ...createMutation } = useContractWrite({
    address: CONTRACT_ADDRESSES.PROFILE_REGISTRY,
    abi: PROFILE_REGISTRY_ABI,
    functionName: 'createProfile',
  })

  return {
    // Direct contract instance
    contract: profileRegistry,

    // Hook data and methods
    profile,
    createProfile: async (metadataURI: string) => {
      return createProfile({ args: [metadataURI] })
    },

    // Query states
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
  }
}

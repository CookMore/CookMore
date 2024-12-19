import { accessABI } from '@/app/api/blockchain/abis'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { ROLES } from '../constants/roles'
import { publicClient } from '@/app/api/blockchain/config/client'
import { Address } from 'viem'

export async function hasRequiredRole(address: string, role: string): Promise<boolean> {
  try {
    const contractAddress = getContractAddress('ACCESS_CONTROL') as Address
    const normalizedAddress = address.toLowerCase() as `0x${string}`
    const normalizedRole = role as `0x${string}`

    const [isAdmin, hasRole] = await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi: accessABI,
        functionName: 'hasRole',
        args: [ROLES.ADMIN, normalizedAddress],
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: accessABI,
        functionName: 'hasRole',
        args: [normalizedRole, normalizedAddress],
      }),
    ])

    return isAdmin || hasRole
  } catch (error) {
    console.error('Error checking role:', error)
    return false
  }
}

export async function checkRoleAccess(address: string): Promise<{
  isAdmin: boolean
  canManageProfiles: boolean
  canManageMetadata: boolean
}> {
  try {
    const contractAddress = getContractAddress('ACCESS_CONTROL') as Address
    const normalizedAddress = address.toLowerCase() as `0x${string}`

    const [isAdmin, canManageProfiles, canManageMetadata] = await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi: accessABI,
        functionName: 'hasRole',
        args: [ROLES.ADMIN as `0x${string}`, normalizedAddress],
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: accessABI,
        functionName: 'hasRole',
        args: [ROLES.PROFILE_MANAGER as `0x${string}`, normalizedAddress],
      }),
      publicClient.readContract({
        address: contractAddress,
        abi: accessABI,
        functionName: 'hasRole',
        args: [ROLES.METADATA_MANAGER as `0x${string}`, normalizedAddress],
      }),
    ])

    return {
      isAdmin,
      canManageProfiles,
      canManageMetadata,
    }
  } catch (error) {
    console.error('Error checking role access:', error)
    return {
      isAdmin: false,
      canManageProfiles: false,
      canManageMetadata: false,
    }
  }
}

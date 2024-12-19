import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { accessABI } from '@/app/api/blockchain/abis'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { ROLES } from '../constants/roles'

export async function hasRequiredRole(address: string, role: string): Promise<boolean> {
  try {
    const accessControlContract = await getServerContract({
      address: getContractAddress('ACCESS_CONTROL'),
      abi: accessABI,
    })
    const [isAdmin, hasRole] = await Promise.all([
      accessControlContract.read('hasRole', [ROLES.ADMIN, address]),
      accessControlContract.read('hasRole', [role, address]),
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
    const accessControlContract = await getServerContract({
      address: getContractAddress('ACCESS_CONTROL'),
      abi: accessABI,
    })

    const [isAdmin, canManageProfiles, canManageMetadata] = await Promise.all([
      accessControlContract.read('hasRole', [ROLES.ADMIN, address]),
      accessControlContract.read('hasRole', [ROLES.PROFILE_MANAGER, address]),
      accessControlContract.read('hasRole', [ROLES.METADATA_MANAGER, address]),
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

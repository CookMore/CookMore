// checkCookMoreRole.ts
import { ethers } from 'ethers'

/**
 * Utility to check if a given user has a certain role in CookMoreAccessControl.
 * Provide the contract address, ABI, role hash, user address, and provider.
 */
export async function hasCookMoreRole(
  contractAddress: string,
  abi: any,
  roleHash: string,
  userAddress: string,
  provider: ethers.Provider | ethers.Signer
): Promise<boolean> {
  const contract = new ethers.Contract(contractAddress, abi, provider)
  const result: boolean = await contract.hasRole(roleHash, userAddress)
  return result
}

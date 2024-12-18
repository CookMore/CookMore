import { getContract, type Address, type PublicClient, type Abi } from 'viem'
import { publicClient } from '../config/client'
import { profileABI } from '../abis/profile'
import { tierABI } from '../abis/tier'
import { usdcABI } from '../abis/usdc'
import { CONTRACTS } from '../config/contracts'

const contractInstances: Record<string, ReturnType<typeof getContract>> = {}

export async function getServerContract<TAbi extends Abi>({
  address,
  abi,
  key = address, // Allow custom cache key
}: {
  address: Address
  abi: TAbi
  key?: string
}) {
  try {
    if (!contractInstances[key]) {
      if (!address) {
        throw new Error(`Contract address not configured for ${key}`)
      }

      if (!publicClient) {
        throw new Error('Public client not initialized')
      }

      // Ensure the client is ready
      await new Promise((resolve) => setTimeout(resolve, 0))

      contractInstances[key] = getContract({
        address,
        abi,
        publicClient,
      })
    }

    return contractInstances[key]
  } catch (error) {
    console.error(`Error getting contract instance for ${key}:`, error)
    throw error
  }
}

export async function getContracts() {
  const profileContract = await getServerContract({
    address: CONTRACTS.PROFILE as Address,
    abi: profileABI,
    key: 'profile',
  })

  const tierContract = await getServerContract({
    address: CONTRACTS.TIER as Address,
    abi: tierABI,
    key: 'tier',
  })

  const usdcContract = await getServerContract({
    address: CONTRACTS.USDC as Address,
    abi: usdcABI,
    key: 'usdc',
  })

  return { profileContract, tierContract, usdcContract }
}

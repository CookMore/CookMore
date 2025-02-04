import { getContract, type Address, type Abi } from 'viem'
import { publicClient } from '../config/client'
import { profileABI } from '../abis/profile'
import { tierABI } from '../abis/tier'
import { usdcABI } from '../abis/usdc'
import { accessABI } from '../abis/access'
import { CONTRACTS } from '../config/contracts'
import { stickyABI } from '../abis/sticky'

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
    console.log('Attempting to get contract for key:', key)

    if (!contractInstances[key]) {
      console.log('No cached contract instance found for key:', key)

      if (!address) {
        console.error(`Contract address not configured for ${key}`)
        throw new Error(`Contract address not configured for ${key}`)
      }

      if (!publicClient) {
        console.error('Public client not initialized')
        throw new Error('Public client not initialized')
      }

      // Ensure the client is ready
      await new Promise((resolve) => setTimeout(resolve, 0))
      console.log('Public client is ready')

      contractInstances[key] = getContract({
        address,
        abi,
        client: publicClient,
      })
      console.log('Contract instance created for key:', key)
    } else {
      console.log('Using cached contract instance for key:', key)
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

  const accessControlContract = await getServerContract({
    address: CONTRACTS.ACCESS_CONTROL as Address,
    abi: accessABI,
    key: 'access',
  })

  const stickyContract = await getServerContract({
    address: CONTRACTS.STICKY_NOTE as Address,
    abi: stickyABI as Abi,
    key: 'sticky',
  })

  return { profileContract, tierContract, usdcContract, accessControlContract, stickyContract }
}

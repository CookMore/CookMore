import { getContract, type Address, type PublicClient } from 'viem'
import { PROFILE_REGISTRY_ABI } from '../abis'
import { publicClient } from '../config/client'
import { getAddresses } from '../utils/addresses'

const addresses = getAddresses()
const PROFILE_REGISTRY_ADDRESS = addresses.PROFILE_REGISTRY as Address

let contractInstance: ReturnType<typeof getContract> | null = null

export async function getProfileRegistryContract() {
  try {
    console.log('Getting Profile Registry contract...')
    console.log('Contract address:', PROFILE_REGISTRY_ADDRESS)
    console.log('Public client ready:', !!publicClient)

    if (!contractInstance) {
      if (!PROFILE_REGISTRY_ADDRESS) {
        throw new Error('Profile Registry address not configured')
      }

      if (!publicClient) {
        throw new Error('Public client not initialized')
      }

      // Ensure the client is ready
      await new Promise((resolve) => setTimeout(resolve, 0))

      contractInstance = getContract({
        address: PROFILE_REGISTRY_ADDRESS,
        abi: PROFILE_REGISTRY_ABI,
        client: publicClient,
      })

      console.log('Contract instance created:', !!contractInstance)
    }

    return contractInstance
  } catch (error) {
    console.error('Failed to initialize Profile Registry contract:', error)
    throw error
  }
}

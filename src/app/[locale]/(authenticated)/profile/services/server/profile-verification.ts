import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { profileABI } from '@/app/api/blockchain/abis/profile'

const chain = process.env.NEXT_PUBLIC_NETWORK === 'production' ? base : baseSepolia

export async function verifyProfileOnChain(address: string): Promise<boolean> {
  try {
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    })

    const contractAddress = process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY as `0x${string}`

    const result = await publicClient.readContract({
      address: contractAddress,
      abi: profileABI,
      functionName: 'getProfile',
      args: [address as `0x${string}`],
    })

    return result?.exists || false
  } catch (error) {
    console.error('Error verifying profile:', error)
    return false
  }
}

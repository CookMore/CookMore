import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { recipeABI } from '@/app/api/blockchain/abis/recipe'

const chain = process.env.NEXT_PUBLIC_NETWORK === 'production' ? base : baseSepolia

export async function verifyRecipeOnChain(address: string): Promise<boolean> {
  try {
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    })

    const contractAddress = process.env.NEXT_PUBLIC_TESTNET_RECIPE_REGISTRY as `0x${string}`

    const addressBigInt = BigInt(address)

    const result = await publicClient.readContract({
      address: contractAddress,
      abi: recipeABI,
      functionName: 'getRecipe',
      args: [addressBigInt],
    })

    return Boolean(result)
  } catch (error) {
    console.error('Error verifying recipe on-chain:', error)
    return false
  }
}

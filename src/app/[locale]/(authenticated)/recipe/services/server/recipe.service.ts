'use server'

import { ethers } from 'ethers'
import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { recipeABI } from '@/app/api/blockchain/abis'
import { cache } from 'react'
import { RecipeMetadata, RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { getTierStatus as getTierStatusFromContract } from '@/app/api/tiers/tiers'
import { decodeRecipeEvent } from '@/app/api/blockchain/utils/recipe.eventDecoder'
import type { Abi } from 'viem'

console.log('NEXT_PUBLIC_BASE_MAINNET_RPC_URL:', process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL)
console.log('NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL:', process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)

const mainnetProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL
)

const sepoliaProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
)

function getProvider(network: 'mainnet' | 'sepolia'): ethers.providers.JsonRpcProvider {
  return network === 'mainnet' ? mainnetProvider : sepoliaProvider
}

async function getTierStatus(address: string): Promise<TierStatus> {
  const contract = await getServerContract(recipeABI, getContractAddress('recipe'))
  return getTierStatusFromContract(contract, address)
}

function hexZeroPad(value: string | undefined, length: number): string {
  return ethers.utils.hexZeroPad(value || '0x', length)
}

type RecipeServiceData = {
  recipeMetadata: RecipeMetadata | null
  recipe: RecipeData | null
  recipeTier: RecipeTier | null
  recipeFormData: RecipeData | null
}

export async function getRecipe(
  address: string,
  network: 'mainnet' | 'sepolia'
): Promise<RecipeServiceData> {
  const provider = getProvider(network)
  const contract = new ethers.Contract(getContractAddress('recipe'), recipeABI, provider)

  const recipeMetadata: RecipeMetadata = await contract.getRecipeMetadata(address)
  const recipe: RecipeData = await contract.getRecipe(address)

  return {
    recipeMetadata,
    recipe,
    recipeTier: null, // Placeholder if needed in the future
    recipeFormData: null, // Add logic to fetch form data if needed
  }
}

export async function getCachedRecipe(
  address: string,
  network: 'mainnet' | 'sepolia'
): Promise<RecipeServiceData | null> {
  // Implement caching logic if needed
  return null
}

export async function createRecipe(metadata: RecipeMetadata) {
  // Implement recipe creation logic
}

export async function updateRecipe(metadata: RecipeMetadata) {
  // Implement recipe update logic
}

export async function deleteRecipe() {
  // Implement recipe deletion logic
}

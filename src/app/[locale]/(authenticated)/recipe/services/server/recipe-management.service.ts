'use server'

import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { recipeABI } from '@/app/api/blockchain/abis'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import type { RecipeMetadata } from '../../types/recipe'
import { revalidatePath } from 'next/cache'
import { recipeMetadataSchema } from '../../validations/recipe'
import { ROLES } from '../../constants/roles'
import { hasRequiredRole } from '../../utils/role-utils'
import { decodeRecipeEvent } from '@/app/api/blockchain/utils/recipe.eventDecoder'

interface RecipeManagementResponse {
  success: boolean
  error?: string
  data?: any
}

// Helper function to validate metadata
async function validateMetadata(metadata: RecipeMetadata): Promise<string | null> {
  try {
    recipeMetadataSchema.parse(metadata)
    return null
  } catch (error) {
    return error instanceof Error ? error.message : 'Validation error'
  }
}

export async function createRecipe(
  callerAddress: string,
  metadata: RecipeMetadata
): Promise<RecipeManagementResponse> {
  const validationError = await validateMetadata(metadata)
  if (validationError) {
    return { success: false, error: validationError }
  }

  try {
    const contract = await getServerContract(recipeABI, getContractAddress('RECIPE_NFT'))
    const tx = await contract.createRecipe(metadata, { from: callerAddress })
    const receipt = await tx.wait()
    const event = decodeRecipeEvent(receipt.logs, contract.interface)

    if (!event) {
      throw new Error('RecipeCreated event not found')
    }

    revalidatePath(`/recipes/${event.args.recipeId}`)

    return { success: true, data: event.args }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function updateRecipe(
  callerAddress: string,
  recipeId: string,
  metadata: RecipeMetadata
): Promise<RecipeManagementResponse> {
  const validationError = await validateMetadata(metadata)
  if (validationError) {
    return { success: false, error: validationError }
  }

  try {
    const contract = await getServerContract(recipeABI, getContractAddress('RECIPE_NFT'))
    const tx = await contract.updateRecipe(recipeId, metadata, { from: callerAddress })
    const receipt = await tx.wait()
    const event = decodeRecipeEvent(receipt.logs, contract.interface)

    if (!event) {
      throw new Error('RecipeUpdated event not found')
    }

    revalidatePath(`/recipes/${recipeId}`)

    return { success: true, data: event.args }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function deleteRecipe(
  callerAddress: string,
  recipeId: string
): Promise<RecipeManagementResponse> {
  try {
    const contract = await getServerContract(recipeABI, getContractAddress('RECIPE_NFT'))
    const tx = await contract.deleteRecipe(recipeId, { from: callerAddress })
    await tx.wait()

    revalidatePath(`/recipes`)

    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function fetchAndDecodeRecipe(address: string) {
  try {
    const contract = await getServerContract(recipeABI, getContractAddress('RECIPE_NFT'))
    const data = await contract.getRecipe(address)
    return data
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

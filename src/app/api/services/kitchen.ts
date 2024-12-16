'use client'

import { kitchenEdgeService } from '@/lib/edge/services'
import type {
  Recipe,
  RecipeMetadata,
  ServiceResponse,
  RecipeActionResponse,
  RecipeVersion,
} from '@/app/api/types/recipe'

export class KitchenService {
  private edgeService = kitchenEdgeService

  static async getRecipe(recipeId: string): Promise<ServiceResponse<Recipe>> {
    return kitchenEdgeService.getRecipe(recipeId)
  }

  static async updateRecipe(
    recipeId: string,
    data: Partial<RecipeMetadata>
  ): Promise<RecipeActionResponse> {
    return kitchenEdgeService.updateRecipe(recipeId, data)
  }

  static async getCollection(userId: string): Promise<ServiceResponse<Recipe[]>> {
    return kitchenEdgeService.getCollection(userId)
  }

  static async getVersions(recipeId: string): Promise<ServiceResponse<RecipeVersion[]>> {
    return kitchenEdgeService.getVersions(recipeId)
  }

  static async invalidateRecipe(recipeId: string): Promise<void> {
    return kitchenEdgeService.invalidateRecipe(recipeId)
  }

  static async invalidateCollection(userId: string): Promise<void> {
    return kitchenEdgeService.invalidateCollection(userId)
  }
}

// Export singleton instance and individual methods for convenience
export const kitchenService = new KitchenService()
export const getRecipe = KitchenService.getRecipe
export const updateRecipe = KitchenService.updateRecipe
export const getCollection = KitchenService.getCollection
export const getVersions = KitchenService.getVersions
export const invalidateRecipe = KitchenService.invalidateRecipe
export const invalidateCollection = KitchenService.invalidateCollection

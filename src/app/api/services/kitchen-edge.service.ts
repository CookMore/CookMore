import type { Recipe, ServiceResponse, RecipeVersion } from '@/app/api/types/recipe'
import type { EdgeServiceOptions } from './types'

class KitchenEdgeService {
  async getRecipe(
    recipeId: string,
    options?: EdgeServiceOptions
  ): Promise<ServiceResponse<Recipe>> {
    // Implementation will be added later
    throw new Error('Not implemented')
  }

  async getVersions(
    recipeId: string,
    options?: EdgeServiceOptions
  ): Promise<ServiceResponse<RecipeVersion[]>> {
    // Implementation will be added later
    throw new Error('Not implemented')
  }

  async getCollection(
    userId: string,
    options?: EdgeServiceOptions
  ): Promise<ServiceResponse<Recipe[]>> {
    // Implementation will be added later
    throw new Error('Not implemented')
  }

  async invalidateRecipe(recipeId: string): Promise<void> {
    // Implementation will be added later
  }

  async invalidateCollection(userId: string): Promise<void> {
    // Implementation will be added later
  }
}

export const kitchenEdgeService = new KitchenEdgeService()

import { BaseEdgeService, EdgeServiceOptions } from './base'
import { EDGE_CACHE_KEYS } from '../config/constants'
import type { 
  Recipe,
  RecipeMetadata,
  ServiceResponse,
  RecipeActionResponse,
  RecipeVersion
} from '@/types/recipe'

export class KitchenEdgeService extends BaseEdgeService {
  private getRecipeCacheKey(recipeId: string): string {
    return EDGE_CACHE_KEYS.KITCHEN(recipeId)
  }

  private getCollectionCacheKey(userId: string): string {
    return EDGE_CACHE_KEYS.COLLECTION(userId)
  }

  async getRecipe(
    recipeId: string,
    options: EdgeServiceOptions = {}
  ): Promise<ServiceResponse<Recipe>> {
    const cacheKey = this.getRecipeCacheKey(recipeId)
    
    return this.withCache(
      cacheKey,
      async () => {
        const response = await fetch(`/api/kitchen/${recipeId}`, {
          headers: this.getHeaders(options)
        })
        return response.json()
      },
      { ...options, ttl: this.ttl.KITCHEN }
    )
  }

  async updateRecipe(
    recipeId: string,
    data: Partial<RecipeMetadata>,
    options: EdgeServiceOptions = {}
  ): Promise<RecipeActionResponse> {
    const cacheKey = this.getRecipeCacheKey(recipeId)
    
    const response = await fetch(`/api/kitchen/${recipeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getHeaders(options)
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    await this.cache.delete(cacheKey)
    return result
  }

  async getCollection(
    userId: string,
    options: EdgeServiceOptions = {}
  ): Promise<ServiceResponse<Recipe[]>> {
    const cacheKey = this.getCollectionCacheKey(userId)
    
    return this.withCache(
      cacheKey,
      async () => {
        const response = await fetch(`/api/kitchen/collection/${userId}`, {
          headers: this.getHeaders(options)
        })
        return response.json()
      },
      { ...options, ttl: this.ttl.KITCHEN }
    )
  }

  async getVersions(
    recipeId: string,
    options: EdgeServiceOptions = {}
  ): Promise<ServiceResponse<RecipeVersion[]>> {
    return this.withCache(
      `${this.getRecipeCacheKey(recipeId)}:versions`,
      async () => {
        const response = await fetch(`/api/kitchen/${recipeId}/versions`, {
          headers: this.getHeaders(options)
        })
        return response.json()
      },
      { ...options, ttl: this.ttl.KITCHEN }
    )
  }

  async invalidateRecipe(recipeId: string): Promise<void> {
    const cacheKey = this.getRecipeCacheKey(recipeId)
    await this.cache.delete(cacheKey)
    await this.cache.delete(`${cacheKey}:versions`)
  }

  async invalidateCollection(userId: string): Promise<void> {
    const cacheKey = this.getCollectionCacheKey(userId)
    await this.cache.delete(cacheKey)
  }
}

// Export singleton instance
export const kitchenEdgeService = new KitchenEdgeService()

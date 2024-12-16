'use client'

import { BaseEdgeService, type EdgeServiceConfig, type ServiceResponse } from './base'
import type { Recipe, RecipeVersion } from '@/app/api/types/recipe'

export interface KitchenEdgeServiceConfig extends EdgeServiceConfig {
  apiEndpoint?: string
}

export class KitchenEdgeService extends BaseEdgeService {
  constructor(config: KitchenEdgeServiceConfig = {}) {
    super({
      ...config,
      baseUrl: config.apiEndpoint || '/api/kitchen',
    })
  }

  async getRecipes(): Promise<ServiceResponse<Recipe[]>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/recipes`, {
        headers: this.getHeaders(),
      })
      return this.handleResponse<Recipe[]>(response)
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch recipes',
      }
    }
  }

  async getRecipe(id: string): Promise<ServiceResponse<Recipe>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/recipes/${id}`, {
        headers: this.getHeaders(),
      })
      return this.handleResponse<Recipe>(response)
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch recipe',
      }
    }
  }

  async getVersions(id: string): Promise<ServiceResponse<RecipeVersion[]>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/recipes/${id}/versions`, {
        headers: this.getHeaders(),
      })
      return this.handleResponse<RecipeVersion[]>(response)
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch versions',
      }
    }
  }

  async updateRecipe(id: string, data: Partial<Recipe>): Promise<ServiceResponse<Recipe>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/recipes/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return this.handleResponse<Recipe>(response)
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update recipe',
      }
    }
  }
}

export const kitchenEdgeService = new KitchenEdgeService()

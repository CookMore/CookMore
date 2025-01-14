'use client'

import { openDB, type IDBPDatabase } from 'idb'
import type { Recipe, RecipeMetadata } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

interface RecipeDB {
  recipes: {
    key: string
    value: Recipe
  }
  metadata: {
    key: string
    value: RecipeMetadata
  }
}

const DB_NAME = 'recipe_cache'
const DB_VERSION = 1

class RecipeCacheService {
  private db: IDBPDatabase<RecipeDB> | null = null

  private async initDB() {
    if (!this.db) {
      this.db = await openDB<RecipeDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          db.createObjectStore('recipes', { keyPath: 'key' })
          db.createObjectStore('metadata', { keyPath: 'key' })
        },
      })
    }
  }

  private async getDB() {
    if (!this.db) {
      await this.initDB()
    }
    return this.db
  }

  async cacheRecipe(address: string, recipe: Recipe) {
    const db = await this.getDB()
    await db.put('recipes', { key: address, value: recipe })
  }

  async getCachedRecipe(address: string): Promise<Recipe | null> {
    const db = await this.getDB()
    return (await db.get('recipes', address))?.value || null
  }

  async cacheMetadata(address: string, metadata: RecipeMetadata) {
    const db = await this.getDB()
    await db.put('metadata', { key: address, value: metadata })
  }

  async getCachedMetadata(address: string): Promise<RecipeMetadata | null> {
    const db = await this.getDB()
    return (await db.get('metadata', address))?.value || null
  }

  async clearCache() {
    const db = await this.getDB()
    await db.clear('recipes')
    await db.clear('metadata')
  }
}

export const recipeCacheService = new RecipeCacheService()

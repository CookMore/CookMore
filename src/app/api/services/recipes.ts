// This file will be our "blockchain interface"
// Later we'll replace these functions with actual blockchain calls

import { mockRecipes } from '@/data/mock-recipes'
import { Recipe, RecipeVersion } from '@/app/api/types/recipe'

export const recipeService = {
  async getRecipe(id: string): Promise<Recipe | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockRecipes.find((r) => r.id === id)
  },

  async getRecipes(): Promise<Recipe[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockRecipes
  },

  async createVersion(
    recipeId: string,
    changes: Partial<Recipe>,
    message: string
  ): Promise<RecipeVersion> {
    const recipe = await this.getRecipe(recipeId)
    if (!recipe) throw new Error('Recipe not found')

    const newVersion: RecipeVersion = {
      id: `v${recipe.versions.length + 1}`,
      message,
      changes,
      timestamp: new Date(),
      parentId: recipe.currentVersionId,
    }

    recipe.versions.push(newVersion)
    recipe.currentVersionId = newVersion.id
    recipe.updatedAt = new Date()

    return newVersion
  },

  async forkRecipe(recipeId: string, newOwner: string): Promise<Recipe> {
    const recipe = await this.getRecipe(recipeId)
    if (!recipe) throw new Error('Recipe not found')

    const forkedRecipe: Recipe = {
      ...recipe,
      id: `${recipeId}-fork-${recipe.forks.length + 1}`,
      owner: newOwner,
      forks: [],
      versions: [...recipe.versions],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRecipes.push(forkedRecipe)
    recipe.forks.push(forkedRecipe.id)

    return forkedRecipe
  },
}

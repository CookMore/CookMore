import { KitchenDraft, PartialRecipeData } from '@/types/recipe'

const STORAGE_KEY = 'kitchen_recipes'

// Helper function to get recipes from localStorage
function getStoredRecipes(): KitchenDraft[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Helper function to save recipes to localStorage
function saveRecipes(recipes: KitchenDraft[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}

export function createDraft(data: Partial<KitchenDraft>): KitchenDraft {
  const recipes = getStoredRecipes()
  const newDraft: KitchenDraft = {
    draftId: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    draftStatus: 'draft',
    recipeStatus: 'active',
    title: data.title || 'Untitled Recipe',
    description: data.description || '',
    version: data.version || '1.0.0',
    equipment: data.equipment || [],
    servingPlating: data.servingPlating || '',
    pairings: data.pairings || [],
    skills: data.skills || [],
    ...data,
  }

  recipes.push(newDraft)
  saveRecipes(recipes)
  return newDraft
}

export function updateDraft(draftId: string, data: Partial<KitchenDraft>): KitchenDraft {
  const recipes = getStoredRecipes()
  const index = recipes.findIndex((r) => r.draftId === draftId)

  if (index === -1) {
    throw new Error('Draft not found')
  }

  const updatedDraft: KitchenDraft = {
    ...recipes[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  recipes[index] = updatedDraft
  saveRecipes(recipes)
  return updatedDraft
}

export function getDraft(draftId: string): KitchenDraft | null {
  const recipes = getStoredRecipes()
  return recipes.find((r) => r.draftId === draftId) || null
}

export function listDrafts(): KitchenDraft[] {
  return getStoredRecipes()
}

export function deleteDraft(draftId: string): void {
  const recipes = getStoredRecipes()
  const filtered = recipes.filter((r) => r.draftId !== draftId)
  saveRecipes(filtered)
}

export function publishDraft(draftId: string): KitchenDraft {
  const recipes = getStoredRecipes()
  const index = recipes.findIndex((r) => r.draftId === draftId)

  if (index === -1) {
    throw new Error('Draft not found')
  }

  recipes[index] = {
    ...recipes[index],
    draftStatus: 'published',
    updatedAt: new Date().toISOString(),
  }

  saveRecipes(recipes)
  return recipes[index]
}

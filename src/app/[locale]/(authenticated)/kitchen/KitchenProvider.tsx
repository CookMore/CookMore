'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/hooks/useAuth'
import { toast } from 'sonner'
import { Recipe } from '@/app/api/types/recipe'

interface KitchenContextType {
  recipes: Recipe[]
  isLoading: boolean
  error: Error | null
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>
  deleteRecipe: (id: string) => Promise<void>
  refreshRecipes: () => Promise<void>
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined)

export function KitchenProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  const fetchRecipes = async (showErrorToast = false) => {
    try {
      const response = await fetch('/api/recipes')
      if (!response.ok) throw new Error('Failed to fetch recipes')
      const data = await response.json()
      setRecipes(data)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to fetch recipes')
      setError(errorMessage)
      if (showErrorToast) {
        toast.error('Failed to load recipes')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchRecipes(false)
    }
  }, [user])

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      })
      if (!response.ok) throw new Error('Failed to add recipe')
      await fetchRecipes(true)
      toast.success('Recipe added successfully')
    } catch (err) {
      toast.error('Failed to add recipe')
      throw err
    }
  }

  const updateRecipe = async (id: string, recipe: Partial<Recipe>) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      })
      if (!response.ok) throw new Error('Failed to update recipe')
      await fetchRecipes(true)
      toast.success('Recipe updated successfully')
    } catch (err) {
      toast.error('Failed to update recipe')
      throw err
    }
  }

  const deleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete recipe')
      await fetchRecipes(true)
      toast.success('Recipe deleted successfully')
    } catch (err) {
      toast.error('Failed to delete recipe')
      throw err
    }
  }

  const value = {
    recipes,
    isLoading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refreshRecipes: () => fetchRecipes(true),
  }

  return <KitchenContext.Provider value={value}>{children}</KitchenContext.Provider>
}

export function useKitchen() {
  const context = useContext(KitchenContext)
  if (context === undefined) {
    throw new Error('useKitchen must be used within a KitchenProvider')
  }
  return context
}

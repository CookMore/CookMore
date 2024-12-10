'use client'

import { useState, useCallback } from 'react'
import { useRecipe } from '@/app/providers/RecipeProvider'
import type { IngredientGroup, IngredientItem } from '@/types/recipe'

export function useIngredients() {
  const { recipeData, updateRecipe } = useRecipe()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addIngredientGroup = useCallback(
    async (group: IngredientGroup) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedGroups = [...(recipeData?.ingredients || []), group]
        await updateRecipe({ ingredients: updatedGroups })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add ingredient group'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.ingredients, updateRecipe]
  )

  const addIngredientToGroup = useCallback(
    async (groupIndex: number, item: IngredientItem) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedGroups = [...(recipeData?.ingredients || [])]
        if (!updatedGroups[groupIndex]) {
          throw new Error('Group not found')
        }
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          items: [...(updatedGroups[groupIndex].items || []), item],
        }
        await updateRecipe({ ingredients: updatedGroups })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add ingredient to group'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.ingredients, updateRecipe]
  )

  const updateIngredientGroup = useCallback(
    async (index: number, group: IngredientGroup) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedGroups = [...(recipeData?.ingredients || [])]
        updatedGroups[index] = group
        await updateRecipe({ ingredients: updatedGroups })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update ingredient group'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.ingredients, updateRecipe]
  )

  const updateIngredientInGroup = useCallback(
    async (groupIndex: number, itemIndex: number, item: IngredientItem) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedGroups = [...(recipeData?.ingredients || [])]
        if (!updatedGroups[groupIndex]) {
          throw new Error('Group not found')
        }
        const updatedItems = [...updatedGroups[groupIndex].items]
        updatedItems[itemIndex] = item
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          items: updatedItems,
        }
        await updateRecipe({ ingredients: updatedGroups })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update ingredient in group'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.ingredients, updateRecipe]
  )

  const removeIngredientGroup = useCallback(
    async (index: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedGroups = recipeData?.ingredients?.filter((_, i) => i !== index) || []
        await updateRecipe({ ingredients: updatedGroups })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove ingredient group'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.ingredients, updateRecipe]
  )

  const removeIngredientFromGroup = useCallback(
    async (groupIndex: number, itemIndex: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedGroups = [...(recipeData?.ingredients || [])]
        if (!updatedGroups[groupIndex]) {
          throw new Error('Group not found')
        }
        const updatedItems = updatedGroups[groupIndex].items.filter((_, i) => i !== itemIndex)
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          items: updatedItems,
        }
        await updateRecipe({ ingredients: updatedGroups })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove ingredient from group'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.ingredients, updateRecipe]
  )

  const reorderIngredientGroups = useCallback(
    async (startIndex: number, endIndex: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const groups = [...(recipeData?.ingredients || [])]
        const [removed] = groups.splice(startIndex, 1)
        groups.splice(endIndex, 0, removed)
        await updateRecipe({ ingredients: groups })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to reorder ingredient groups'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.ingredients, updateRecipe]
  )

  const reorderIngredientsInGroup = useCallback(
    async (groupIndex: number, startIndex: number, endIndex: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedGroups = [...(recipeData?.ingredients || [])]
        if (!updatedGroups[groupIndex]) {
          throw new Error('Group not found')
        }
        const items = [...updatedGroups[groupIndex].items]
        const [removed] = items.splice(startIndex, 1)
        items.splice(endIndex, 0, removed)
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          items,
        }
        await updateRecipe({ ingredients: updatedGroups })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to reorder ingredients in group'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.ingredients, updateRecipe]
  )

  return {
    ingredientGroups: recipeData?.ingredients || [],
    addIngredientGroup,
    addIngredientToGroup,
    updateIngredientGroup,
    updateIngredientInGroup,
    removeIngredientGroup,
    removeIngredientFromGroup,
    reorderIngredientGroups,
    reorderIngredientsInGroup,
    isLoading,
    error,
  }
}

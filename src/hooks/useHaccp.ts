'use client'

import { useState, useCallback } from 'react'
import { useRecipe } from '@/app/providers/RecipeProvider'
import type { HaccpPlan } from '@/types/recipe'

export function useHaccp() {
  const { recipeData, updateRecipe } = useRecipe()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addHaccpPoint = useCallback(
    async (point: HaccpPlan) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedPoints = [...(recipeData?.haccpPlan || []), point]
        await updateRecipe({
          haccpPlan: updatedPoints,
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add HACCP point'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.haccpPlan, updateRecipe]
  )

  const updateHaccpPoint = useCallback(
    async (index: number, point: HaccpPlan) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedPoints = [...(recipeData?.haccpPlan || [])]
        updatedPoints[index] = point
        await updateRecipe({
          haccpPlan: updatedPoints,
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update HACCP point'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.haccpPlan, updateRecipe]
  )

  const removeHaccpPoint = useCallback(
    async (index: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedPoints = recipeData?.haccpPlan?.filter((_, i) => i !== index) || []
        await updateRecipe({
          haccpPlan: updatedPoints,
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove HACCP point'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.haccpPlan, updateRecipe]
  )

  return {
    haccpPlan: recipeData?.haccpPlan || [],
    addHaccpPoint,
    updateHaccpPoint,
    removeHaccpPoint,
    isLoading,
    error,
  }
}

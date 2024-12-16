'use client'

import { useState, useCallback } from 'react'
import { useRecipe } from '@/app/api/providers/RecipeProvider'
import type { RecipeData } from '@/app/api/types/recipe'

export function useRecipePreview() {
  const { recipeData } = useRecipe()
  const [previewData, setPreviewData] = useState<Partial<RecipeData> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const generatePreview = useCallback(async () => {
    if (!recipeData) return null

    setIsLoading(true)
    setError(null)

    try {
      // For now, just return the current recipe data
      // In the future, this could generate a preview with AI assistance
      setPreviewData(recipeData)
      return recipeData
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate preview'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [recipeData])

  const clearPreview = useCallback(() => {
    setPreviewData(null)
    setError(null)
  }, [])

  return {
    previewData,
    generatePreview,
    clearPreview,
    isLoading,
    error,
  }
}

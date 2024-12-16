'use client'

import { useState, useCallback } from 'react'
import { useRecipe } from '@/app/api/providers/RecipeProvider'
import type { Inspiration } from '@/app/api/types/recipe'

interface InspirationSource {
  type: 'recipe' | 'chef' | 'restaurant' | 'book' | 'other'
  name: string
  url?: string
  notes?: string
}

export function useInspiration() {
  const { recipeData, updateRecipe } = useRecipe()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addInspirationSource = useCallback(
    async (source: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedSources = [...(recipeData?.inspiration?.sources || []), source]
        await updateRecipe({
          inspiration: {
            ...recipeData?.inspiration,
            sources: updatedSources,
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add inspiration source'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.inspiration, updateRecipe]
  )

  const addInspirationImage = useCallback(
    async (imageUrl: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedImages = [...(recipeData?.inspiration?.images || []), imageUrl]
        await updateRecipe({
          inspiration: {
            ...recipeData?.inspiration,
            images: updatedImages,
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add inspiration image'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.inspiration, updateRecipe]
  )

  const updateNotes = useCallback(
    async (notes: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await updateRecipe({
          inspiration: {
            ...recipeData?.inspiration,
            notes,
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update inspiration notes'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.inspiration, updateRecipe]
  )

  const removeInspirationSource = useCallback(
    async (index: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedSources = recipeData?.inspiration?.sources?.filter((_, i) => i !== index) || []
        await updateRecipe({
          inspiration: {
            ...recipeData?.inspiration,
            sources: updatedSources,
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove inspiration source'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.inspiration, updateRecipe]
  )

  const removeInspirationImage = useCallback(
    async (index: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const updatedImages = recipeData?.inspiration?.images?.filter((_, i) => i !== index) || []
        await updateRecipe({
          inspiration: {
            ...recipeData?.inspiration,
            images: updatedImages,
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove inspiration image'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.inspiration, updateRecipe]
  )

  return {
    inspiration: recipeData?.inspiration,
    addInspirationSource,
    addInspirationImage,
    updateNotes,
    removeInspirationSource,
    removeInspirationImage,
    isLoading,
    error,
  }
}

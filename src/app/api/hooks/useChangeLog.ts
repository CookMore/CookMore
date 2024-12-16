'use client'

import { useState, useCallback } from 'react'
import { useRecipe } from '@/app/providers/RecipeProvider'
import type { ChangeLogEntry } from '@/app/api/types/recipe'

export function useChangeLog() {
  const { recipeData, updateRecipe } = useRecipe()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addChange = useCallback(
    async (description: string) => {
      setIsLoading(true)
      setError(null)

      try {
        const newChange: ChangeLogEntry = {
          version: '1.0',
          type: 'update',
          date: new Date().toISOString(),
          author: 'user',
          message: description,
        }

        const updatedEntries = [...(recipeData?.changeLogDetails?.entries || []), newChange]
        await updateRecipe({
          changeLogDetails: {
            entries: updatedEntries,
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add change'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [recipeData?.changeLogDetails?.entries, updateRecipe]
  )

  const clearChangelog = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await updateRecipe({
        changeLogDetails: {
          entries: [],
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear changelog'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [updateRecipe])

  return {
    changes: recipeData?.changeLogDetails?.entries || [],
    addChange,
    clearChangelog,
    isLoading,
    error,
  }
}

import { useState, useCallback, useEffect } from 'react'

interface StoredRecipeData {
  recipeData: Partial<RecipeData>
  lastUpdated: number
  currentStep: number
}

interface UseRecipeStorage {
  storedData: StoredRecipeData | null
  isLoading: boolean
  error: string | null
  saveDraft: (data: Partial<RecipeData>, step: number) => Promise<void>
  loadDraft: () => Promise<StoredRecipeData | null>
  clearDraft: () => Promise<void>
  hasDraft: boolean
}

const STORAGE_KEY = 'recipe_draft'

export function useRecipeStorage(): UseRecipeStorage {
  const [storedData, setStoredData] = useState<StoredRecipeData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasDraft, setHasDraft] = useState(false)

  const saveDraft = useCallback(async (data: Partial<RecipeData>, step: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const draftData: StoredRecipeData = {
        recipeData: data,
        lastUpdated: Date.now(),
        currentStep: step,
      }

      // Save to local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData))

      // Update state
      setStoredData(draftData)
      setHasDraft(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save draft'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadDraft = useCallback(async (): Promise<StoredRecipeData | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const storedJson = localStorage.getItem(STORAGE_KEY)

      if (!storedJson) {
        setHasDraft(false)
        return null
      }

      const data: StoredRecipeData = JSON.parse(storedJson)
      setStoredData(data)
      setHasDraft(true)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load draft'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearDraft = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      localStorage.removeItem(STORAGE_KEY)
      setStoredData(null)
      setHasDraft(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear draft'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check for existing draft on mount
  useEffect(() => {
    loadDraft().catch(console.error)
  }, [loadDraft])

  return {
    storedData,
    isLoading,
    error,
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  }
}

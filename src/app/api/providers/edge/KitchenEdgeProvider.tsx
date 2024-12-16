'use client'

import React, { useCallback } from 'react'
import { BaseEdgeProvider, useEdgeContext } from './BaseEdgeProvider'
import { kitchenEdgeService } from '@/app/api/services/kitchen-edge.service'
import type { Recipe, ServiceResponse, RecipeVersion } from '@/app/api/types/recipe'

interface KitchenEdgeContextValue {
  recipe: ServiceResponse<Recipe> | null
  versions: ServiceResponse<RecipeVersion[]> | null
  collection: ServiceResponse<Recipe[]> | null
  isLoading: boolean
  error: Error | null
  refreshRecipe: () => Promise<void>
  refreshVersions: () => Promise<void>
  refreshCollection: () => Promise<void>
  clearKitchenCache: () => Promise<void>
}

const KitchenEdgeContext = React.createContext<KitchenEdgeContextValue | null>(null)

export function KitchenEdgeProvider({
  children,
  recipeId,
  userId,
}: {
  children: React.ReactNode
  recipeId?: string
  userId?: string
}) {
  const [recipe, setRecipe] = React.useState<ServiceResponse<Recipe> | null>(null)
  const [versions, setVersions] = React.useState<ServiceResponse<RecipeVersion[]> | null>(null)
  const [collection, setCollection] = React.useState<ServiceResponse<Recipe[]> | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const { options } = useEdgeContext()

  const refreshRecipe = useCallback(async () => {
    if (!recipeId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await kitchenEdgeService.getRecipe(recipeId, options)
      setRecipe(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recipe'))
    } finally {
      setIsLoading(false)
    }
  }, [recipeId, options])

  const refreshVersions = useCallback(async () => {
    if (!recipeId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await kitchenEdgeService.getVersions(recipeId, options)
      setVersions(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch versions'))
    } finally {
      setIsLoading(false)
    }
  }, [recipeId, options])

  const refreshCollection = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await kitchenEdgeService.getCollection(userId, options)
      setCollection(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collection'))
    } finally {
      setIsLoading(false)
    }
  }, [userId, options])

  const clearKitchenCache = useCallback(async () => {
    if (recipeId) {
      await kitchenEdgeService.invalidateRecipe(recipeId)
      await refreshRecipe()
      await refreshVersions()
    }
    if (userId) {
      await kitchenEdgeService.invalidateCollection(userId)
      await refreshCollection()
    }
  }, [recipeId, userId, refreshRecipe, refreshVersions, refreshCollection])

  // Initial fetch
  React.useEffect(() => {
    if (recipeId) {
      refreshRecipe()
      refreshVersions()
    }
    if (userId) {
      refreshCollection()
    }
  }, [recipeId, userId, refreshRecipe, refreshVersions, refreshCollection])

  return (
    <KitchenEdgeContext.Provider
      value={{
        recipe,
        versions,
        collection,
        isLoading,
        error,
        refreshRecipe,
        refreshVersions,
        refreshCollection,
        clearKitchenCache,
      }}
    >
      {children}
    </KitchenEdgeContext.Provider>
  )
}

export function useKitchenEdge() {
  const context = React.useContext(KitchenEdgeContext)
  if (!context) {
    throw new Error('useKitchenEdge must be used within a KitchenEdgeProvider')
  }
  return context
}

// Composite provider that includes both Base and Kitchen providers
export function KitchenEdgeProviderWithBase({
  children,
  recipeId,
  userId,
  initialOptions = {},
}: {
  children: React.ReactNode
  recipeId?: string
  userId?: string
  initialOptions?: Parameters<typeof BaseEdgeProvider>[0]['initialOptions']
}) {
  return (
    <BaseEdgeProvider initialOptions={initialOptions}>
      <KitchenEdgeProvider recipeId={recipeId} userId={userId}>
        {children}
      </KitchenEdgeProvider>
    </BaseEdgeProvider>
  )
}

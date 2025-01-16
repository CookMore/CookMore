'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'
import { useContract } from '@/app/[locale]/(authenticated)/recipe/client/useContract'
import { recipeABI } from '@/app/api/blockchain/abis'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { useRecipePreview } from '@/app/[locale]/(authenticated)/recipe/hooks/useRecipePreview'
import { useChangeLog } from '@/app/[locale]/(authenticated)/recipe/hooks/useChangeLog'

interface RecipeContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  recipeData: Partial<RecipeData>
  updateRecipe: (updates: Partial<RecipeData>) => void
  isLoading: boolean
  privacySetting: string
  setPrivacySetting: (setting: string) => void
  state: { recipeData: Partial<RecipeData> }
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export function RecipeProvider({
  children,
  mode,
}: {
  children: ReactNode
  mode: 'create' | 'edit'
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [recipeData, setRecipeData] = useState<Partial<RecipeData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const contract = useContract(getContractAddress('RECIPE_NFT'), recipeABI)
  const { updatePreview } = useRecipePreview()
  const { addChangeLogEntry } = useChangeLog()
  const [privacySetting, setPrivacySetting] = useState<string>('public')

  const state = { recipeData }

  useEffect(() => {
    console.log('useEffect triggered on mount')
    const fetchData = async () => {
      console.log('fetchData called')
      // Fetch or initialize data here
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const updateRecipe = useCallback((updates: Partial<RecipeData>) => {
    console.log('updateRecipe called with updates:', updates)
    setRecipeData((prev) => {
      const newRecipeData: RecipeData = {
        ...prev,
        ...updates,
        title: updates.title ?? prev.title ?? '',
        description: updates.description ?? prev.description ?? '',
        version: updates.version ?? prev.version ?? '',
        owner: updates.owner ?? prev.owner ?? '',
        status: updates.status ?? prev.status ?? 'alpha',
        forkedFrom: updates.forkedFrom ?? prev.forkedFrom ?? '',
        visibility: updates.visibility ?? prev.visibility ?? 'public',
        servings: updates.servings ?? prev.servings ?? 1,
        prepTime: updates.prepTime ?? prev.prepTime ?? 0,
        cookTime: updates.cookTime ?? prev.cookTime ?? 0,
        ingredients: updates.ingredients ?? prev.ingredients ?? [],
        method: updates.method ?? prev.method ?? '',
        tags: updates.tags ?? prev.tags ?? [],
        changeLogDetails: updates.changeLogDetails ?? prev.changeLogDetails ?? { entries: [] },
      }

      // Only update if there are changes
      if (JSON.stringify(prev) !== JSON.stringify(newRecipeData)) {
        return newRecipeData
      }
      return prev
    })
  }, [])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-accent-fg mb-2'></div>
          <p className='text-github-fg-default'>Loading recipe data...</p>
        </div>
      </div>
    )
  }

  return (
    <RecipeContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        recipeData,
        updateRecipe,
        isLoading,
        privacySetting,
        setPrivacySetting,
        state,
      }}
    >
      {children}
    </RecipeContext.Provider>
  )
}

export function useRecipe() {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider')
  }
  return context
}

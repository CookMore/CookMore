'use client'

import React, { createContext, useContext, useState } from 'react'
import { RecipeData } from '@/app/api/types/recipe'

interface RecipeContextType {
  recipeData: RecipeData
  updateRecipe: (updates: Partial<RecipeData>) => void
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipeData, setRecipeData] = useState<RecipeData>({
    title: '',
    description: '',
    servings: 0,
    prepTime: 0,
    cookTime: 0,
    ingredients: [],
    specialtyIngredients: [],
    equipment: [],
    skills: {
      required: [],
      recommended: [],
      certifications: [],
      training: [],
    },
    preProduction: [],
    productionMethod: {
      defaultFlow: [],
      modules: [],
    },
    haccpPlan: [],
    servingPlating: undefined,
    finishingTouch: undefined,
    finalImage: undefined,
    inspiration: {
      sources: [],
      images: [],
      notes: undefined,
    },
    categories: [],
    cuisines: [],
    occasions: [],
    tags: [],
    customTags: [],
    version: undefined,
    status: undefined,
    signatures: [],
    id: undefined,
    owner: undefined,
    forkedFrom: undefined,
    license: undefined,
    difficulty: undefined,
    portionSize: undefined,
    totalYield: undefined,
    coverImage: undefined,
    videoUrl: undefined,
  })

  const updateRecipe = (updates: Partial<RecipeData>) => {
    setRecipeData((prev: RecipeData) => ({
      ...prev,
      ...updates,
    }))
  }

  return (
    <RecipeContext.Provider value={{ recipeData, updateRecipe }}>{children}</RecipeContext.Provider>
  )
}

export function useRecipe() {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider')
  }
  return context
}

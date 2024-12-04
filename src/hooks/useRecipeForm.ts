'use client'

import { useState } from 'react'

export function useRecipeForm() {
  const [recipeData, setRecipeData] = useState({
    name: '',
    description: '',
    prepTime: undefined,
    cookTime: undefined,
    servings: undefined,
    difficulty: '',
    dietary: [] as string[],
    ingredients: [] as Array<{
      amount: string
      unit: string
      item: string
      notes?: string
    }>,
    steps: [] as Array<{
      type: 'prep' | 'cook'
      content: string
      image?: string
      time?: number
      timeUnit?: 'minutes' | 'hours'
    }>,
  })

  const updateRecipeData = (updates: Partial<typeof recipeData>) => {
    setRecipeData((current) => ({
      ...current,
      ...updates,
    }))
  }

  return {
    recipeData,
    updateRecipeData,
  }
}

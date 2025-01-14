'use client'

import React, { createContext, useContext, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/hooks/useAuth'
import { toast } from 'sonner'
import { Recipe } from '../../../[locale]/(authenticated)/recipe/types/recipe'

interface KitchenContextType {
  recipes: any[]
  isLoading: boolean
  error: Error | null
  selectedRecipe: any | null
  setSelectedRecipe: (recipe: any) => void
  calendar: {
    meals: {
      date: string
      breakfast: any | null
      lunch: any | null
      dinner: any | null
    }[]
  }
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined)

export function useKitchen() {
  const context = useContext(KitchenContext)
  if (context === undefined) {
    throw new Error('useKitchen must be used within a KitchenProvider')
  }
  return context
}

export function KitchenProvider({ children }: { children: React.ReactNode }) {
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null)

  // Fetch recipes
  const {
    data: recipes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      // TODO: Implement recipe fetching
      return []
    },
  })

  // Initialize calendar with empty meals
  const calendar = {
    meals: Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i)
      return {
        date: date.toISOString(),
        breakfast: null,
        lunch: null,
        dinner: null,
      }
    }),
  }

  const value = {
    recipes,
    isLoading,
    error,
    selectedRecipe,
    setSelectedRecipe,
    calendar,
  }

  return <KitchenContext.Provider value={value}>{children}</KitchenContext.Provider>
}

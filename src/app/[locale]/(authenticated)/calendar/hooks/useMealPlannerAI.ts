'use client'

import { useState } from 'react'
import { useAuth } from '@/app/api/auth/hooks/useAuth'

interface MealPlanFormData {
  timeToCook: string
  cuisineType: string
  preferences: string[]
  dietaryRestrictions: string
  inspiration: string
}

interface MealPlanResponse {
  mealPlan: string
}

export function useMealPlannerAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { currentTier } = useAuth()

  const generateMealPlan = async (data: MealPlanFormData): Promise<MealPlanResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/en/calendar/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          tier: currentTier,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate meal plan')
      }

      const result = await response.json()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateMealPlan,
    isLoading,
    error,
  }
}

'use client'

import { useRecipe } from '../context/RecipeContext'
import { STEPS } from '../steps/index'
import {
  recipeMetadataSchema,
  recipeDataSchema,
} from '@/app/[locale]/(authenticated)/recipe/validations/recipe'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'
import { validateStep } from '../validations/recipe'
import { useCallback, useRef, useEffect } from 'react'
import { debounce } from 'lodash'
import { isEqual } from 'lodash'

export function RecipePreview() {
  const { recipeData, updateRecipe } = useRecipe()
  const latestDataRef = useRef<RecipeData>(recipeData)

  useEffect(() => {
    latestDataRef.current = recipeData
  }, [recipeData])

  const debouncedUpdateRecipe = useCallback(
    debounce(async (completeData: RecipeData) => {
      if (!isEqual(latestDataRef.current.productionMethod, completeData.productionMethod)) {
        try {
          await updateRecipe(completeData)
        } catch (error) {
          console.error('Error updating recipe:', error)
        }
      }
    }, 300),
    []
  )

  const fillDefaults = (data: Partial<RecipeData>): RecipeData => {
    const defaultData: RecipeData = {
      title: '',
      description: '',
      prepTime: 1,
      cookTime: 1,
      servings: 1,
      difficulty: 'easy' as any,
      dietary: [],
      portionSize: '',
      totalYield: '',
      categories: [],
      cuisines: [],
      occasions: [],
      tags: [],
      customTags: [],
      skills: {
        required: [],
        recommended: [],
        certifications: [],
        training: [],
      },
      ingredients: [],
      specialtyIngredients: [],
      equipment: [],
      preProduction: [],
      productionMethod: {
        defaultFlow: [],
        modules: [],
      },
      haccpPlan: [],
      servingPlating: {
        instructions: [],
        temperature: '',
        timing: '',
        notes: '',
        presentation: [],
        garnish: [],
        service: [],
        image: '',
      },
      finishingTouch: {
        notes: '',
        presentation: '',
        image: '',
      },
      finalImage: '',
      coverImage: '',
      videoUrl: '',
      inspiration: {
        sources: [],
        images: [],
        notes: '',
      },
      signatures: [],
      versions: [],
      currentVersionId: '',
      forks: [],
      isDraft: false,
      cookCount: 0,
      likes: 0,
      comments: 0,
      image: '',
      changeLogDetails: {
        entries: [],
      },
    }
    return {
      ...defaultData,
      ...data,
    }
  }

  return (
    <div className='max-h-screen overflow-y-auto p-4'>
      {STEPS.map(({ id, component: StepComponent, label }) => (
        <div key={id} className='mb-6'>
          <h3 className='text-lg font-semibold mb-2'>{label}</h3>
          <StepComponent
            data={recipeData}
            onChange={(updatedData: Partial<RecipeData>) => {
              const completeData = fillDefaults(updatedData)
              const validationErrors = validateStep(id, completeData)

              if (Object.keys(validationErrors).length > 0) {
                console.error('Validation errors:', validationErrors)
                return
              }

              // Use the debounced function to update the recipe
              debouncedUpdateRecipe(completeData)
            }}
          />
        </div>
      ))}
    </div>
  )
}

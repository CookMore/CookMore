'use client'

import { useState } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { useSpecialtyIngredients } from '@/app/[locale]/(authenticated)/recipe/hooks/useSpecialtyIngredients'
import { IconPlus, IconX, IconAlertCircle, IconLoader } from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'

export function SpecialtyIngredients({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const { updateSpecialtyIngredients } = useSpecialtyIngredients()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addSpecialtyIngredient = async () => {
    setError('')
    const newIngredient = {
      item: '',
      source: '',
      substitute: '',
      notes: '',
      handling: '',
    }

    const updates = {
      specialtyIngredients: [...(state.recipeData.specialtyIngredients || []), newIngredient],
    }

    try {
      updateRecipe(updates)
      if (state.recipeData.id) {
        setIsLoading(true)
        await updateSpecialtyIngredients(state.recipeData.id, updates.specialtyIngredients)
      }
    } catch (err) {
      setError('Failed to add specialty ingredient')
    } finally {
      setIsLoading(false)
    }
  }

  const updateIngredient = async (
    index: number,
    updates: Partial<(typeof state.recipeData.specialtyIngredients)[0]>
  ) => {
    setError('')
    const current = [...(state.recipeData.specialtyIngredients || [])]
    current[index] = { ...current[index], ...updates }

    const ingredientUpdates = { specialtyIngredients: current }

    try {
      updateRecipe(ingredientUpdates)
      if (state.recipeData.id) {
        setIsLoading(true)
        await updateSpecialtyIngredients(state.recipeData.id, current)
      }
    } catch (err) {
      setError('Failed to update specialty ingredient')
    } finally {
      setIsLoading(false)
    }
  }

  const removeIngredient = async (index: number) => {
    setError('')
    const filtered = state.recipeData.specialtyIngredients?.filter((_, i) => i !== index) || []

    try {
      updateRecipe({ specialtyIngredients: filtered })
      if (state.recipeData.id) {
        setIsLoading(true)
        await updateSpecialtyIngredients(state.recipeData.id, filtered)
      }
    } catch (err) {
      setError('Failed to remove specialty ingredient')
    } finally {
      setIsLoading(false)
    }
  }

  const validateSpecialtyIngredients = () => {
    if (!state.recipeData.specialtyIngredients?.length) {
      return true // Optional section
    }

    const invalidIngredients = state.recipeData.specialtyIngredients.filter(
      (ing) => !ing.item?.trim() || !ing.source?.trim() || !ing.handling?.trim()
    )

    if (invalidIngredients.length > 0) {
      setError('All specialty ingredients must have a name, source, and handling instructions')
      return false
    }

    return true
  }

  return (
    <BaseStep
      title='Specialty Ingredients'
      description='List any specialty or hard-to-source ingredients with their details and handling instructions.'
      data={state.recipeData}
      onChange={updateRecipe}
      onNext={() => validateSpecialtyIngredients() && onNext()}
      onBack={onBack}
      isValid={!error && !isLoading}
      isSaving={isLoading}
    >
      {error && (
        <div className='mb-4 p-3 bg-github-danger-subtle rounded-md flex items-center text-github-danger-fg'>
          <IconAlertCircle className='w-4 h-4 mr-2' />
          {error}
        </div>
      )}

      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2 text-github-fg-muted'>
            <IconAlertCircle className='w-5 h-5' />
            <span className='text-sm'>
              Include sourcing and handling information for specialty items
            </span>
          </div>
          <button
            onClick={addSpecialtyIngredient}
            disabled={isLoading}
            className='flex items-center space-x-2 px-4 py-2 bg-github-success-emphasis 
                     text-white rounded-md disabled:opacity-50'
          >
            {isLoading ? (
              <IconLoader className='w-4 h-4 animate-spin' />
            ) : (
              <IconPlus className='w-4 h-4' />
            )}
            <span>Add Specialty Ingredient</span>
          </button>
        </div>

        <div className='space-y-4'>
          {state.recipeData.specialtyIngredients?.map((ingredient, index) => (
            <div key={index} className='space-y-4 p-4 bg-github-canvas-subtle rounded-md'>
              <div className='flex justify-between items-start'>
                <div className='flex-1 grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-github-fg-default mb-2'>
                      Ingredient
                    </label>
                    <input
                      type='text'
                      value={ingredient.item}
                      onChange={(e) => updateIngredient(index, { item: e.target.value })}
                      className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                      placeholder='Ingredient name'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-github-fg-default mb-2'>
                      Source
                    </label>
                    <input
                      type='text'
                      value={ingredient.source}
                      onChange={(e) => updateIngredient(index, { source: e.target.value })}
                      className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                      placeholder='Where to source'
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeIngredient(index)}
                  className='ml-4 text-github-fg-muted hover:text-github-danger-fg'
                >
                  <IconX className='w-5 h-5' />
                </button>
              </div>

              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-2'>
                  Substitute Options
                </label>
                <input
                  type='text'
                  value={ingredient.substitute}
                  onChange={(e) => updateIngredient(index, { substitute: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  placeholder='Possible substitutes'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-2'>
                  Handling Instructions
                </label>
                <textarea
                  value={ingredient.handling}
                  onChange={(e) => updateIngredient(index, { handling: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  rows={3}
                  placeholder='Special handling or storage requirements'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-2'>
                  Additional Notes
                </label>
                <textarea
                  value={ingredient.notes}
                  onChange={(e) => updateIngredient(index, { notes: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  rows={2}
                  placeholder='Any additional notes'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseStep>
  )
}

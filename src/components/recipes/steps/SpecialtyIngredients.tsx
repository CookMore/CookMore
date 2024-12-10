'use client'

import { useState } from 'react'
import { useSpecialtyIngredients } from '@/app/(authenticated)/kitchen/hooks/useSpecialtyIngredients'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import { BaseStep } from './BaseStep'
import { RecipeData, SpecialtyIngredient } from '@/types/recipe'
import { IconPlus, IconX, IconAlertCircle, IconLoader } from '@/components/ui/icons'
import { StepComponentProps } from './index'

export function SpecialtyIngredients({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateSpecialtyIngredients } = useSpecialtyIngredients()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addSpecialtyIngredient = async () => {
    setError('')
    const newIngredient: SpecialtyIngredient = {
      item: '',
      source: '',
      substitute: '',
      notes: '',
      handling: '',
    }

    const updates = {
      specialtyIngredients: [...(data.specialtyIngredients || []), newIngredient],
    }

    try {
      onChange(updates)
      await updatePreview('specialtyIngredients', updates)

      if (data.id) {
        setIsLoading(true)
        await updateSpecialtyIngredients(data.id, updates.specialtyIngredients)
      }
    } catch (err) {
      setError('Failed to add specialty ingredient')
      onChange({ specialtyIngredients: data.specialtyIngredients }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const updateIngredient = async (index: number, updates: Partial<SpecialtyIngredient>) => {
    setError('')
    const current = [...(data.specialtyIngredients || [])]
    current[index] = { ...current[index], ...updates }

    const ingredientUpdates = { specialtyIngredients: current }

    try {
      onChange(ingredientUpdates)
      await updatePreview('specialtyIngredients', ingredientUpdates)

      if (data.id) {
        setIsLoading(true)
        await updateSpecialtyIngredients(data.id, current)
      }
    } catch (err) {
      setError('Failed to update specialty ingredient')
      onChange({ specialtyIngredients: data.specialtyIngredients }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const removeIngredient = async (index: number) => {
    setError('')
    const filtered = data.specialtyIngredients?.filter((_, i) => i !== index) || []

    const updates = { specialtyIngredients: filtered }

    try {
      onChange(updates)
      await updatePreview('specialtyIngredients', updates)

      if (data.id) {
        setIsLoading(true)
        await updateSpecialtyIngredients(data.id, filtered)
      }
    } catch (err) {
      setError('Failed to remove specialty ingredient')
      onChange({ specialtyIngredients: data.specialtyIngredients }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateSpecialtyIngredients = () => {
    if (!data.specialtyIngredients?.length) {
      return true // Optional section
    }

    const invalidIngredients = data.specialtyIngredients.filter(
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
      data={data}
      onChange={onChange}
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
          {data.specialtyIngredients?.map((ingredient, index) => (
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

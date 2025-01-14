'use client'

import { useState } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { useServingPlating } from '@/app/[locale]/(authenticated)/recipe/hooks/useServingPlating'
import { IconAlertCircle, IconLoader, IconPlus, IconX, IconThermometer } from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'
import { PlatingDoodler } from '../components/PlatingDoodler'

export function ServingPlating({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const { updateServingPlating } = useServingPlating()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addInstruction = async (type: 'instructions' | 'presentation' | 'garnish') => {
    setError('')
    const current = state.recipeData.servingPlating || {
      instructions: [],
      presentation: [],
      garnish: [],
      temperature: '',
      timing: '',
      notes: [],
    }

    const updates = {
      servingPlating: {
        ...current,
        [type]: [...(current[type] || []), ''],
      },
    }

    try {
      updateRecipe(updates)
      if (state.recipeData.id) {
        setIsLoading(true)
        await updateServingPlating(state.recipeData.id, updates.servingPlating)
      }
    } catch (err) {
      setError(`Failed to add ${type} instruction`)
    } finally {
      setIsLoading(false)
    }
  }

  const updateInstruction = async (
    type: 'instructions' | 'presentation' | 'garnish',
    index: number,
    value: string
  ) => {
    setError('')
    const current = state.recipeData.servingPlating || {
      instructions: [],
      presentation: [],
      garnish: [],
      temperature: '',
      timing: '',
      notes: [],
    }

    const items = [...(current[type] || [])]
    items[index] = value

    const updates = {
      servingPlating: {
        ...current,
        [type]: items,
      },
    }

    try {
      updateRecipe(updates)
      if (state.recipeData.id) {
        setIsLoading(true)
        await updateServingPlating(state.recipeData.id, updates.servingPlating)
      }
    } catch (err) {
      setError(`Failed to update ${type} instruction`)
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = async (field: 'temperature' | 'timing', value: string) => {
    setError('')
    const current = state.recipeData.servingPlating || {
      instructions: [],
      presentation: [],
      garnish: [],
      temperature: '',
      timing: '',
      notes: [],
    }

    const updates = {
      servingPlating: {
        ...current,
        [field]: value,
      },
    }

    try {
      updateRecipe(updates)
      if (state.recipeData.id) {
        setIsLoading(true)
        await updateServingPlating(state.recipeData.id, updates.servingPlating)
      }
    } catch (err) {
      setError(`Failed to update ${field}`)
    } finally {
      setIsLoading(false)
    }
  }

  const validateServingPlating = () => {
    if (!state.recipeData.servingPlating?.instructions?.length) {
      setError('At least one plating instruction is required')
      return false
    }

    if (!state.recipeData.servingPlating.temperature?.trim()) {
      setError('Serving temperature is required')
      return false
    }

    if (!state.recipeData.servingPlating.timing?.trim()) {
      setError('Timing consideration is required')
      return false
    }

    return true
  }

  const servingPlating = state.recipeData.servingPlating || {
    instructions: [''],
    presentation: [],
    garnish: [],
    temperature: '',
    timing: '',
    notes: [],
  }

  return (
    <BaseStep
      title='Serving & Plating'
      description='Define how the dish should be served and plated for optimal presentation.'
      data={state.recipeData}
      onChange={updateRecipe}
      onNext={() => validateServingPlating() && onNext()}
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

      <div className='space-y-8'>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-sm font-medium text-github-fg-default'>Plating Instructions</h3>
            <button
              onClick={() => addInstruction('instructions')}
              disabled={isLoading}
              className='bg-[linear-gradient(#e9e9e9,#e9e9e9_50%,#fff)] group w-auto inline-flex transition-all duration-300 overflow-visible rounded-md'
            >
              <div className='w-full h-full bg-[linear-gradient(to_top,#ececec,#fff)] overflow-hidden p-1 rounded-md hover:shadow-none duration-300'>
                <div className='w-full h-full text-sm gap-x-0.5 gap-y-0.5 justify-center text-white bg-green-500 group-hover:bg-green-600 duration-200 items-center font-medium gap-4 inline-flex overflow-hidden px-4 py-2 rounded-md group-hover:text-blue-600'>
                  {isLoading ? (
                    <IconLoader className='w-4 h-4 animate-spin' />
                  ) : (
                    <IconPlus className='w-4 h-4' />
                  )}
                  <span>Add Instruction</span>
                </div>
              </div>
            </button>
          </div>

          {servingPlating.instructions?.map((instruction, index) => (
            <div key={index} className='flex items-start space-x-2'>
              <input
                type='text'
                value={instruction}
                onChange={(e) => updateInstruction('instructions', index, e.target.value)}
                className='flex-1 px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                placeholder='Enter plating instruction'
              />
              <button
                onClick={() => removeInstruction('instructions', index)}
                className='p-2 text-github-fg-muted hover:text-github-danger-fg'
              >
                <IconX className='w-5 h-5' />
              </button>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-2'>
              Serving Temperature
            </label>
            <div className='flex items-center space-x-2'>
              <IconThermometer className='w-5 h-5 text-github-fg-muted' />
              <input
                type='text'
                value={servingPlating.temperature || ''}
                onChange={(e) => updateField('temperature', e.target.value)}
                className='flex-1 px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                placeholder='e.g., Hot, Cold, Room temperature'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-2'>
              Timing Considerations
            </label>
            <input
              type='text'
              value={servingPlating.timing || ''}
              onChange={(e) => updateField('timing', e.target.value)}
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              placeholder='e.g., Serve immediately, Can hold for 30 minutes'
            />
          </div>
        </div>
      </div>

      <PlatingDoodler />
    </BaseStep>
  )
}

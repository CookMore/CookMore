'use client'

import { useState } from 'react'
import { useServingPlating } from '@/app/(authenticated)/kitchen/hooks/useServingPlating'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import {
  IconAlertCircle,
  IconLoader,
  IconPlus,
  IconX,
  IconThermometer,
} from '@/components/ui/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'
import { RecipeData } from '@/types/recipe'

export function ServingPlating({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateServingPlating } = useServingPlating()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addInstruction = async (type: 'instructions' | 'presentation' | 'garnish') => {
    setError('')
    const current = data.servingPlating || {
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
      onChange(updates)
      await updatePreview('servingPlating', updates)

      if (data.id) {
        setIsLoading(true)
        await updateServingPlating(data.id, updates.servingPlating)
      }
    } catch (err) {
      setError(`Failed to add ${type} instruction`)
      onChange({ servingPlating: current }) // Rollback
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
    const current = data.servingPlating || {
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
      onChange(updates)
      await updatePreview('servingPlating', updates)

      if (data.id) {
        setIsLoading(true)
        await updateServingPlating(data.id, updates.servingPlating)
      }
    } catch (err) {
      setError(`Failed to update ${type} instruction`)
      onChange({ servingPlating: current }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = async (field: 'temperature' | 'timing', value: string) => {
    setError('')
    const current = data.servingPlating || {
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
      onChange(updates)
      await updatePreview('servingPlating', updates)

      if (data.id) {
        setIsLoading(true)
        await updateServingPlating(data.id, updates.servingPlating)
      }
    } catch (err) {
      setError(`Failed to update ${field}`)
      onChange({ servingPlating: current }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateServingPlating = () => {
    if (!data.servingPlating?.instructions?.length) {
      setError('At least one plating instruction is required')
      return false
    }

    if (!data.servingPlating.temperature?.trim()) {
      setError('Serving temperature is required')
      return false
    }

    if (!data.servingPlating.timing?.trim()) {
      setError('Timing consideration is required')
      return false
    }

    return true
  }

  // Initialize servingPlating if it doesn't exist
  const servingPlating = data.servingPlating || {
    instructions: [],
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
      data={data}
      onChange={onChange}
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
        {/* Plating Instructions */}
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-sm font-medium text-github-fg-default'>
              Plating Instructions
              <span className='text-github-danger-fg ml-1'>*</span>
            </h3>
            <button
              onClick={() => addInstruction('instructions')}
              disabled={isLoading}
              className='flex items-center space-x-2 px-3 py-1 text-sm bg-github-success-emphasis 
                       text-white rounded-md disabled:opacity-50'
            >
              {isLoading ? (
                <IconLoader className='w-4 h-4 animate-spin' />
              ) : (
                <IconPlus className='w-4 h-4' />
              )}
              <span>Add Instruction</span>
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

        {/* Temperature & Timing */}
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
    </BaseStep>
  )
}

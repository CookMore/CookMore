'use client'

import { useState } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { BaseStep } from './BaseStep'
import { IconPlus, IconX, IconAlertCircle } from '@/app/api/icons'
import { StepComponentProps } from './index'

export function FinishingTouch({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addFinishingTouch = async (type: 'garnish' | 'sauce' | 'decoration', value: string) => {
    if (!value.trim()) return
    setError('')
    setIsLoading(true)

    const currentTouches = state.recipeData.finishingTouches || {
      garnish: [],
      sauce: [],
      decoration: [],
    }

    const updates = {
      finishingTouches: {
        ...currentTouches,
        [type]: [...(currentTouches[type] || []), value.trim()],
      },
    }

    try {
      updateRecipe(updates)
    } catch (err) {
      setError(`Failed to add ${type}`)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFinishingTouch = async (type: 'garnish' | 'sauce' | 'decoration', index: number) => {
    setError('')
    setIsLoading(true)

    const currentTouches = state.recipeData.finishingTouches || {
      garnish: [],
      sauce: [],
      decoration: [],
    }

    const updates = {
      finishingTouches: {
        ...currentTouches,
        [type]: currentTouches[type].filter((_, i) => i !== index),
      },
    }

    try {
      updateRecipe(updates)
    } catch (err) {
      setError(`Failed to remove ${type}`)
    } finally {
      setIsLoading(false)
    }
  }

  const validateFinishingTouches = () => {
    if (!state.recipeData.finishingTouches?.garnish?.length) {
      setError('At least one garnish is required')
      return false
    }
    return true
  }

  const finishingTouches = state.recipeData.finishingTouches || {
    garnish: [],
    sauce: [],
    decoration: [],
  }

  return (
    <BaseStep
      title='Finishing Touches'
      description='Add the final touches to your dish for presentation and flavor enhancement.'
      data={state.recipeData}
      onChange={updateRecipe}
      onNext={() => validateFinishingTouches() && onNext()}
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
        {/* Garnish */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Garnish</h3>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Add a garnish'
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                       rounded-md focus:ring-2 focus:ring-github-accent-emphasis'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addFinishingTouch('garnish', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              disabled={isLoading}
            />
            <div className='flex flex-wrap gap-2'>
              {finishingTouches.garnish.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 px-2 py-1 bg-github-canvas-subtle rounded-md'
                >
                  <span className='text-sm'>{item}</span>
                  <button onClick={() => removeFinishingTouch('garnish', index)}>
                    <IconX className='w-4 h-4 text-github-fg-muted hover:text-github-danger-fg' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sauce */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Sauce</h3>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Add a sauce'
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addFinishingTouch('sauce', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
            <div className='flex flex-wrap gap-2'>
              {finishingTouches.sauce.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 px-2 py-1 bg-github-canvas-subtle rounded-md'
                >
                  <span className='text-sm'>{item}</span>
                  <button onClick={() => removeFinishingTouch('sauce', index)}>
                    <IconX className='w-4 h-4 text-github-fg-muted hover:text-github-danger-fg' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decoration */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Decoration</h3>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='Add a decoration'
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addFinishingTouch('decoration', e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
            <div className='flex flex-wrap gap-2'>
              {finishingTouches.decoration.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 px-2 py-1 bg-github-canvas-subtle rounded-md'
                >
                  <span className='text-sm'>{item}</span>
                  <button onClick={() => removeFinishingTouch('decoration', index)}>
                    <IconX className='w-4 h-4 text-github-fg-muted hover:text-github-danger-fg' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseStep>
  )
}

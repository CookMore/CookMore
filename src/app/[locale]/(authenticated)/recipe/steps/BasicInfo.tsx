'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { BaseStep } from './BaseStep'
import { IconClock, IconAlertCircle } from '@/app/api/icons'
import { useBasicInfo } from '@/app/[locale]/(authenticated)/recipe/hooks/useBasicInfo'
import { StepComponentProps } from './index'
import { useRecipe } from '../context/RecipeContext'

interface TimeUnit {
  value: number
  unit: 'minutes' | 'hours'
}

interface Errors {
  prepTime: string
  cookTime: string
  servings: string
}

interface TimeUnits {
  prep: 'minutes' | 'hours'
  cook: 'minutes' | 'hours'
}

export function BasicInfo({
  onNext,
  onBack,
  errors = {},
}: StepComponentProps & { errors: Record<string, string[]> }) {
  const { recipeData, updateRecipe } = useRecipe()
  const { updateBasicInfo } = useBasicInfo()
  const [timeUnits, setTimeUnits] = useState<TimeUnits>({
    prep: 'minutes',
    cook: 'minutes',
  })

  const convertToMinutes = (time: string | number, unit: TimeUnit['unit']): number => {
    const timeNumber = typeof time === 'string' ? parseInt(time, 10) : time
    return unit === 'hours' ? timeNumber * 60 : timeNumber
  }

  const convertFromMinutes = (minutes: string | number, unit: TimeUnit['unit']): number => {
    const minutesNumber = typeof minutes === 'string' ? parseInt(minutes, 10) : minutes
    return unit === 'hours' ? minutesNumber / 60 : minutesNumber
  }

  const handleTimeChange = async (
    field: 'prepTime' | 'cookTime',
    value: string,
    unit: TimeUnit['unit']
  ) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      const updates = { [field]: convertToMinutes(numValue, unit) }
      updateRecipe(updates)

      if (recipeData.id) {
        await updateBasicInfo(recipeData.id, updates)
      }
    }
  }

  const handleDietaryChange = async (diet: string, checked: boolean) => {
    const current = recipeData.dietary || []
    const updates = {
      dietary: checked ? [...current, diet] : current.filter((d) => d !== diet),
    }

    updateRecipe(updates)
    if (recipeData.id) {
      await updateBasicInfo(recipeData.id, updates)
    }
  }

  const getTotalTime = () => {
    const prep = recipeData.prepTime ?? 0
    const cook = recipeData.cookTime ?? 0
    return prep + cook
  }

  const handleFunctionCall = (func?: () => void) => {
    if (func) func()
  }

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Low-Carb',
    'Keto',
    'Paleo',
  ]

  return (
    <BaseStep
      title='Basic Information'
      description='Enter the fundamental details about your recipe.'
      data={recipeData}
      onChange={updateRecipe}
      isValid={!errors.prepTime?.length && !errors.cookTime?.length && !errors.servings?.length}
    >
      <div className='space-y-6'>
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Recipe Details</h3>

          <div className='grid grid-cols-2 gap-4'>
            {[
              { label: 'Prep Time', field: 'prepTime' },
              { label: 'Cook Time', field: 'cookTime' },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className='block text-sm font-medium text-github-fg-default mb-1'>
                  {label}
                </label>
                <input
                  type='number'
                  value={recipeData[field as 'prepTime' | 'cookTime'] || 0}
                  onChange={(e) =>
                    handleTimeChange(
                      field as 'prepTime' | 'cookTime',
                      e.target.value,
                      timeUnits[field]
                    )
                  }
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  min='0'
                  placeholder='0'
                />
                {errors[field] && (
                  <p className='text-red-500 text-sm'>{errors[field].join(', ')}</p>
                )}
              </div>
            ))}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-github-fg-default mb-1'>
                Servings*
              </label>
              <input
                type='number'
                value={recipeData.servings || ''}
                onChange={(e) => updateRecipe({ servings: parseInt(e.target.value) })}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                min='1'
                placeholder='4'
              />
              {errors.servings && (
                <p className='text-red-500 text-sm'>{errors.servings.join(', ')}</p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-github-fg-default mb-1'>
                Difficulty
              </label>
              <select
                value={recipeData.difficulty || ''}
                onChange={(e) => updateRecipe({ difficulty: e.target.value as Difficulty })}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              >
                <option value=''>Select difficulty</option>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Advanced</option>
                <option value='expert'>Professional</option>
              </select>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-medium text-github-fg-default'>Dietary Information</h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {dietaryOptions.map((diet) => (
                <label key={diet} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={recipeData.dietary?.includes(diet) || false}
                    onChange={(e) => {
                      handleDietaryChange(diet, e.target.checked)
                    }}
                    className='rounded border-github-border-default text-github-accent-emphasis 
                             focus:ring-github-accent-emphasis'
                  />
                  <span className='text-sm text-github-fg-default'>{diet}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-medium text-github-fg-default'>Yield Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-1'>
                  Portion Size
                </label>
                <input
                  type='text'
                  value={recipeData.portionSize || ''}
                  onChange={(e) => updateRecipe({ portionSize: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  placeholder='e.g., 250g or 1 cup'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-1'>
                  Total Yield
                </label>
                <input
                  type='text'
                  value={recipeData.totalYield || ''}
                  onChange={(e) => updateRecipe({ totalYield: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  placeholder='e.g., 1kg or 4 portions'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseStep>
  )
}

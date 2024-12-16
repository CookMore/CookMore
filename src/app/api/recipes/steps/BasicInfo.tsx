'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { BaseStep } from './BaseStep'
import { IconClock, IconAlertCircle } from '@/components/ui/icons'
import { useBasicInfo } from '@/app/api/hooks/useBasicInfo'
import { StepComponentProps } from './index'
import { useRecipe } from '@/app/api/providers/RecipeProvider'

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

export function BasicInfo({ onNext, onBack }: StepComponentProps) {
  const { recipeData, updateRecipe } = useRecipe()
  const { updateBasicInfo } = useBasicInfo()
  const [errors, setErrors] = useState<Errors>({ prepTime: '', cookTime: '', servings: '' })
  const [timeUnits, setTimeUnits] = useState<TimeUnits>({
    prep: 'minutes',
    cook: 'minutes',
  })

  const convertToMinutes = (time: number, unit: TimeUnit['unit']) => {
    return unit === 'hours' ? time * 60 : time
  }

  const convertFromMinutes = (minutes: number, unit: TimeUnit['unit']) => {
    return unit === 'hours' ? minutes / 60 : minutes
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

  const isValid = useMemo(() => {
    return (
      (recipeData.prepTime && recipeData.prepTime >= 0) ||
      (recipeData.cookTime && recipeData.cookTime >= 0) ||
      (recipeData.servings && recipeData.servings >= 1)
    )
  }, [recipeData.prepTime, recipeData.cookTime, recipeData.servings])

  const validateInputs = useCallback(() => {
    const newErrors = {
      prepTime: (recipeData.prepTime ?? 0) < 0 ? 'Prep time cannot be negative' : '',
      cookTime: (recipeData.cookTime ?? 0) < 0 ? 'Cook time cannot be negative' : '',
      servings: (recipeData.servings ?? 0) < 1 ? 'Must have at least 1 serving' : '',
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }, [recipeData.prepTime, recipeData.cookTime, recipeData.servings])

  const getTotalTime = () => {
    const prep = recipeData.prepTime ?? 0
    const cook = recipeData.cookTime ?? 0
    return prep + cook
  }

  return (
    <BaseStep
      title='Basic Information'
      description='Enter the fundamental details about your recipe.'
      data={recipeData}
      onChange={updateRecipe}
      onNext={() => validateInputs() && onNext()}
      onBack={onBack}
      isValid={isValid}
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
                <div className='flex items-center space-x-2'>
                  <input
                    type='number'
                    value={convertFromMinutes(
                      Number(recipeData[field as keyof RecipeData]) || 0,
                      timeUnits[field === 'prepTime' ? 'prep' : 'cook']
                    )}
                    onChange={(e) =>
                      handleTimeChange(
                        field as 'prepTime' | 'cookTime',
                        e.target.value,
                        timeUnits[field === 'prepTime' ? 'prep' : 'cook']
                      )
                    }
                    className='w-20 px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                    min='0'
                  />
                  <select
                    value={timeUnits[field === 'prepTime' ? 'prep' : 'cook']}
                    onChange={(e) =>
                      setTimeUnits((prev) => ({
                        ...prev,
                        [field === 'prepTime' ? 'prep' : 'cook']: e.target
                          .value as TimeUnit['unit'],
                      }))
                    }
                    className='px-2 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  >
                    <option value='minutes'>minutes</option>
                    <option value='hours'>hours</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {getTotalTime() > 0 && (
            <div className='p-4 bg-github-canvas-subtle rounded-md'>
              <div className='flex items-center space-x-2 text-github-fg-default'>
                <IconClock className='w-4 h-4' />
                <span className='text-sm'>
                  Total Time: {Math.floor(getTotalTime() / 60)}h {getTotalTime() % 60}m
                </span>
              </div>
              <div className='mt-2 h-2 bg-github-canvas-default rounded-full overflow-hidden'>
                <div
                  className='h-full bg-github-success-emphasis'
                  style={{
                    width: `${((recipeData.prepTime || 0) / getTotalTime()) * 100}%`,
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </div>
              <div className='mt-1 flex justify-between text-xs text-github-fg-muted'>
                <span>Prep: {recipeData.prepTime || 0}m</span>
                <span>Cook: {recipeData.cookTime || 0}m</span>
              </div>
            </div>
          )}

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
                <p className='mt-1 text-sm text-red-500 flex items-center'>
                  <IconAlertCircle className='w-4 h-4 mr-1' />
                  {errors.servings}
                </p>
              )}
            </div>
            <div>
              <label className='block text-sm font-medium text-github-fg-default mb-1'>
                Difficulty
              </label>
              <select
                value={recipeData.difficulty || ''}
                onChange={(e) => updateRecipe({ difficulty: e.target.value })}
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
              {[
                'Vegetarian',
                'Vegan',
                'Gluten-Free',
                'Dairy-Free',
                'Nut-Free',
                'Low-Carb',
                'Keto',
                'Paleo',
              ].map((diet) => (
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

'use client'

import { useState } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { usePreProduction } from '@/app/[locale]/(authenticated)/recipe/hooks/usePreProduction'
import { IconPlus, IconX, IconClock, IconAlertCircle, IconLoader } from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'

export function PreProduction({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const { updatePreProductionTasks } = usePreProduction()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addPreProdTask = async () => {
    setError('')
    const newTask = {
      task: '',
      timeframe: '',
      notes: '',
    }

    const updates = {
      preProduction: [...(state.recipeData.preProduction || []), newTask],
    }

    try {
      updateRecipe(updates)
      if (state.recipeData.id) {
        setIsLoading(true)
        await updatePreProductionTasks(state.recipeData.id, updates.preProduction)
      }
    } catch (err) {
      setError('Failed to add pre-production task')
    } finally {
      setIsLoading(false)
    }
  }

  const updateTask = async (
    index: number,
    updates: Partial<(typeof state.recipeData.preProduction)[0]>
  ) => {
    setError('')
    const current = [...(state.recipeData.preProduction || [])]
    current[index] = { ...current[index], ...updates }

    try {
      updateRecipe({ preProduction: current })
      if (state.recipeData.id) {
        setIsLoading(true)
        await updatePreProductionTasks(state.recipeData.id, current)
      }
    } catch (err) {
      setError('Failed to update task')
    } finally {
      setIsLoading(false)
    }
  }

  const removeTask = async (index: number) => {
    setError('')
    const filtered = state.recipeData.preProduction?.filter((_, i) => i !== index) || []

    try {
      updateRecipe({ preProduction: filtered })
      if (state.recipeData.id) {
        setIsLoading(true)
        await updatePreProductionTasks(state.recipeData.id, filtered)
      }
    } catch (err) {
      setError('Failed to remove task')
    } finally {
      setIsLoading(false)
    }
  }

  const validatePreProduction = () => {
    if (!state.recipeData.preProduction?.length) {
      return true // Optional section
    }

    const invalidTasks = state.recipeData.preProduction.filter(
      (task) => !task.task?.trim() || !task.timeframe?.trim()
    )

    if (invalidTasks.length > 0) {
      setError('All tasks must have a description and timeframe')
      return false
    }

    return true
  }

  return (
    <BaseStep
      title='Pre-Production'
      description='Define tasks that need to be completed before starting the recipe.'
      data={state.recipeData}
      onChange={updateRecipe}
      onNext={() => validatePreProduction() && onNext()}
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
        <div className='flex justify-end'>
          <button
            onClick={addPreProdTask}
            disabled={isLoading}
            className='flex items-center space-x-2 px-4 py-2 bg-github-success-emphasis 
                     text-white rounded-md disabled:opacity-50'
          >
            {isLoading ? (
              <IconLoader className='w-4 h-4 animate-spin' />
            ) : (
              <IconPlus className='w-4 h-4' />
            )}
            <span>Add Task</span>
          </button>
        </div>

        <div className='space-y-4'>
          {state.recipeData.preProduction?.map((task, index) => (
            <div
              key={index}
              className='grid grid-cols-12 gap-4 p-4 bg-github-canvas-subtle rounded-md'
            >
              <div className='col-span-5'>
                <input
                  type='text'
                  value={task.task}
                  onChange={(e) => updateTask(index, { task: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  placeholder='Task description'
                />
              </div>

              <div className='col-span-3'>
                <div className='flex items-center space-x-2'>
                  <IconClock className='w-4 h-4 text-github-fg-muted' />
                  <input
                    type='text'
                    value={task.timeframe}
                    onChange={(e) => updateTask(index, { timeframe: e.target.value })}
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                    placeholder='Timeframe'
                  />
                </div>
              </div>

              <div className='col-span-3'>
                <input
                  type='text'
                  value={task.notes}
                  onChange={(e) => updateTask(index, { notes: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  placeholder='Notes (optional)'
                />
              </div>

              <div className='col-span-1 flex items-center justify-end'>
                <button
                  onClick={() => removeTask(index)}
                  className='text-github-fg-muted hover:text-github-danger-fg'
                >
                  <IconX className='w-5 h-5' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseStep>
  )
}

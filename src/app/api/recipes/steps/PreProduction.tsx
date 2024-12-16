'use client'

import { useState } from 'react'
import { usePreProduction } from '@/app/(authenticated)/kitchen/hooks/usePreProduction'
import { useRecipePreview } from '@/app/api/hooks/useRecipePreview'
import { BaseStep } from './BaseStep'
import { RecipeData, PreProductionTask } from '@/app/api/types/recipe'
import { IconPlus, IconX, IconClock, IconAlertCircle, IconLoader } from '@/components/ui/icons'
import { StepComponentProps } from './index'

export function PreProduction({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updatePreProductionTasks } = usePreProduction()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addPreProdTask = async () => {
    setError('')
    const newTask: PreProductionTask = {
      task: '',
      timeframe: '',
      notes: '',
    }

    const updates: Partial<RecipeData> = {
      preProduction: [...(data.preProduction || []), newTask],
    }

    try {
      onChange(updates)
      await updatePreview('preProduction', updates)

      if (data.id && typeof data.id === 'string') {
        setIsLoading(true)
        await updatePreProductionTasks(data.id, updates.preProduction || [])
      }
    } catch (err) {
      setError('Failed to add pre-production task')
      onChange({ preProduction: data.preProduction })
    } finally {
      setIsLoading(false)
    }
  }

  const updateTask = async (index: number, updates: Partial<PreProductionTask>) => {
    setError('')
    const current = [...(data.preProduction || [])] as PreProductionTask[]
    current[index] = { ...current[index], ...updates }

    const taskUpdates: Partial<RecipeData> = { preProduction: current }

    try {
      onChange(taskUpdates)
      await updatePreview('preProduction', taskUpdates)

      if (data.id && typeof data.id === 'string') {
        setIsLoading(true)
        await updatePreProductionTasks(data.id, current)
      }
    } catch (err) {
      setError('Failed to update task')
      onChange({ preProduction: data.preProduction })
    } finally {
      setIsLoading(false)
    }
  }

  const removeTask = async (index: number) => {
    setError('')
    const filtered = data.preProduction?.filter((_, i) => i !== index) || []

    const updates: Partial<RecipeData> = { preProduction: filtered }

    try {
      onChange(updates)
      await updatePreview('preProduction', updates)

      if (data.id && typeof data.id === 'string') {
        setIsLoading(true)
        await updatePreProductionTasks(data.id, filtered)
      }
    } catch (err) {
      setError('Failed to remove task')
      onChange({ preProduction: data.preProduction })
    } finally {
      setIsLoading(false)
    }
  }

  const validatePreProduction = () => {
    if (!data.preProduction?.length) {
      return true // Optional section
    }

    const invalidTasks = data.preProduction.filter(
      (task: PreProductionTask) => !task.task?.trim() || !task.timeframe?.trim()
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
      data={data}
      onChange={onChange}
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
          {data.preProduction?.map((task, index) => (
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

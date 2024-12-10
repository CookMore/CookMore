'use client'

import { BaseStep } from './BaseStep'
import { RecipeData } from '@/types/recipe'
import {
  IconPlus,
  IconX,
  IconAlertTriangle,
  IconFileText,
  IconAlertCircle,
  IconLoader,
} from '@/components/ui/icons'
import { useState } from 'react'
import { useProductionMethod } from '@/app/(authenticated)/kitchen/hooks/useProductionMethod'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import { StepComponentProps } from './index'

export function MethodProduction({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateMethod } = useProductionMethod()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addStep = async () => {
    setError('')
    const newStep = {
      id: `step-${Date.now()}`,
      type: 'step',
      content: '',
      time: undefined,
      timeUnit: 'minutes' as const,
      ingredients: [],
    }

    const updates = {
      productionMethod: {
        ...data.productionMethod,
        defaultFlow: [...(data.productionMethod?.defaultFlow || []), newStep],
      },
    }

    try {
      onChange(updates)
      await updatePreview('productionMethod', updates)

      if (data.id) {
        setIsLoading(true)
        await updateMethod(data.id, updates.productionMethod)
      }
    } catch (err) {
      setError('Failed to add step')
      onChange({ productionMethod: data.productionMethod }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const addModule = () => {
    const newModule = {
      id: `module-${Date.now()}`,
      title: '',
      steps: [],
    }

    onChange({
      productionMethod: {
        ...data.productionMethod,
        modules: [...(data.productionMethod?.modules || []), newModule],
      },
    })
  }

  const updateStep = async (
    index: number,
    updates: Partial<RecipeData['productionMethod']['defaultFlow'][0]>
  ) => {
    setError('')
    const current = [...(data.productionMethod?.defaultFlow || [])]
    current[index] = { ...current[index], ...updates }

    const methodUpdates = {
      productionMethod: {
        ...data.productionMethod,
        defaultFlow: current,
      },
    }

    try {
      onChange(methodUpdates)
      await updatePreview('productionMethod', methodUpdates)

      if (data.id) {
        setIsLoading(true)
        await updateMethod(data.id, methodUpdates.productionMethod)
      }
    } catch (err) {
      setError('Failed to update step')
      onChange({ productionMethod: data.productionMethod }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const removeStep = async (index: number) => {
    setError('')
    const updates = {
      productionMethod: {
        ...data.productionMethod,
        defaultFlow: data.productionMethod?.defaultFlow?.filter((_, i) => i !== index),
      },
    }

    try {
      onChange(updates)
      await updatePreview('productionMethod', updates)

      if (data.id) {
        setIsLoading(true)
        await updateMethod(data.id, updates.productionMethod)
      }
    } catch (err) {
      setError('Failed to remove step')
      onChange({ productionMethod: data.productionMethod }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateMethod = () => {
    if (!data.productionMethod?.defaultFlow?.length) {
      setError('At least one production step is required')
      return false
    }

    const invalidSteps = data.productionMethod.defaultFlow.filter(
      (step) => !step.content?.trim() || (step.time !== undefined && step.time < 0)
    )

    if (invalidSteps.length > 0) {
      setError('All steps must have instructions and valid time values')
      return false
    }

    return true
  }

  return (
    <BaseStep
      title='Method of Production'
      description='Define the step-by-step production process with detailed instructions.'
      data={data}
      onChange={onChange}
      onNext={() => validateMethod() && onNext()}
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
        <div className='flex justify-end space-x-4'>
          <button
            onClick={addModule}
            disabled={isLoading}
            className='flex items-center space-x-2 px-4 py-2 bg-github-canvas-subtle 
                     text-github-fg-default rounded-md disabled:opacity-50'
          >
            {isLoading ? (
              <IconLoader className='w-4 h-4 animate-spin' />
            ) : (
              <IconFileText className='w-4 h-4' />
            )}
            <span>Add Module</span>
          </button>
          <button onClick={addStep} disabled={isLoading}>
            <IconPlus className='w-4 h-4' />
            <span>Add Step</span>
          </button>
        </div>

        <div className='space-y-8'>
          {data.productionMethod?.defaultFlow?.map((step, index) => (
            <div key={step.id} className='space-y-4 p-6 bg-github-canvas-subtle rounded-lg'>
              <div className='flex justify-between items-start'>
                <h3 className='text-lg font-medium text-github-fg-default'>Step {index + 1}</h3>
                <div className='flex items-center space-x-2'>
                  <button onClick={() => removeStep(index)}>
                    <IconX className='w-5 h-5' />
                  </button>
                </div>
              </div>

              <div className='space-y-4'>
                <textarea
                  value={step.content}
                  onChange={(e) => updateStep(index, { content: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  rows={4}
                  placeholder='Step instructions...'
                />

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-github-fg-default mb-2'>
                      Time Required
                    </label>
                    <div className='flex space-x-2'>
                      <input
                        type='number'
                        value={step.time || ''}
                        onChange={(e) => updateStep(index, { time: parseInt(e.target.value) })}
                        className='w-24 px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                        placeholder='Time'
                      />
                      <select
                        value={step.timeUnit}
                        onChange={(e) =>
                          updateStep(index, { timeUnit: e.target.value as 'minutes' | 'hours' })
                        }
                        className='px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                      >
                        <option value='minutes'>minutes</option>
                        <option value='hours'>hours</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {step.warning && (
                  <div className='flex items-start space-x-2 p-3 bg-github-danger-subtle rounded-md'>
                    <IconAlertTriangle className='w-5 h-5 text-github-danger-fg' />
                    <p className='text-sm text-github-danger-fg'>{step.warning}</p>
                  </div>
                )}

                {/* Notes */}
                {step.notes?.length > 0 && (
                  <div className='space-y-2'>
                    {step.notes.map((note, noteIndex) => (
                      <div
                        key={noteIndex}
                        className='flex items-start space-x-2 p-3 bg-github-canvas-inset rounded-md'
                      >
                        <IconAlertCircle className='w-5 h-5 text-github-fg-muted' />
                        <p className='text-sm text-github-fg-muted'>{note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className='flex justify-center'>
            <button onClick={addStep}>
              <IconPlus className='w-5 h-5' />
              <span className='font-medium'>Add Next Step</span>
            </button>
          </div>
        </div>
      </div>
    </BaseStep>
  )
}

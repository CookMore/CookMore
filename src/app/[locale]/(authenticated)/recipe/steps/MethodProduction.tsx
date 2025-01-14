'use client'

import { BaseStep } from './BaseStep'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'
import { IconPlus, IconX, IconAlertCircle } from '@/app/api/icons'
import { useState, useEffect, useCallback } from 'react'
import { useProductionMethod } from '@/app/[locale]/(authenticated)/recipe/hooks/useProductionMethod'
import { useRecipePreview } from '@/app/[locale]/(authenticated)/recipe/hooks/useRecipePreview'
import { StepComponentProps } from './index'
import { CriticalControlPoint } from '../components/CriticalControlPoint'
import { useRecipeStorage } from '@/app/[locale]/(authenticated)/recipe/hooks/core/useRecipeStorage'
import { debounce } from 'lodash'
import { isEqual } from 'lodash'

type ProductionStep = {
  id: string
  content: string
  time: number // Ensure this is a number
  timeUnit: string
  warning?: string
  notes?: string[]
  type: string
  ingredients: string[]
}

export function MethodProduction({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateMethod } = useProductionMethod()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [ccps, setCcps] = useState<{ stepId: string; note: string }[]>([])
  const { storedData, saveDraft, loadDraft, clearDraft } = useRecipeStorage()
  const [isCcpOpen, setIsCcpOpen] = useState(false)
  const [openStepIndex, setOpenStepIndex] = useState<number>(0)

  useEffect(() => {
    if (storedData) {
      onChange(storedData.recipeData)
    }
  }, [storedData, onChange])

  const addStep = async () => {
    setError('')
    const newStep: ProductionStep = {
      id: `step-${Date.now()}`,
      content: '',
      time: 1, // Ensure minimum time is 1
      timeUnit: 'minutes',
      type: '',
      ingredients: [],
    }

    const updates = {
      productionMethod: {
        ...data.productionMethod,
        defaultFlow: [...(data.productionMethod?.defaultFlow || []), newStep],
      },
    }

    if (isEqual(data.productionMethod, updates.productionMethod)) {
      return // No changes, so do not update
    }

    try {
      onChange(updates)
      await updatePreview('productionMethod', updates)
      await saveDraft(updates, data.currentStep || 0)

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

  const updateStep = async (index: number, updates: Partial<ProductionStep>) => {
    setError('')
    const current = [...(data.productionMethod?.defaultFlow || [])]
    current[index] = { ...current[index], ...updates }

    const methodUpdates = {
      productionMethod: {
        ...data.productionMethod,
        defaultFlow: current,
      },
    }

    if (!current[index].type || !current[index].ingredients || current[index].time < 1) {
      setError('Step must have a type, ingredients, and a valid time')
      return
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
        defaultFlow: data.productionMethod?.defaultFlow?.filter((_: any, i: number) => i !== index),
      },
    }

    try {
      onChange(updates)
      await updatePreview('productionMethod', updates)
      await saveDraft(updates, data.currentStep || 0)

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
      (step: ProductionStep) => !step.content?.trim() || (step.time ?? 0) < 1
    )

    if (invalidSteps.length > 0) {
      setError('All steps must have instructions and valid time values')
      return false
    }

    return true
  }

  const addCcpToStep = (stepId: string, ccp: { note: string }) => {
    setCcps((prev) => [...prev, { stepId, ...ccp }])

    const updatedSteps = data.productionMethod?.defaultFlow?.map((step) =>
      step.id === stepId ? { ...step, notes: [...(step.notes || []), ccp.note] } : step
    )

    const updates = {
      productionMethod: {
        ...data.productionMethod,
        defaultFlow: updatedSteps,
      },
    }

    onChange(updates)
    saveDraft(updates, data.currentStep || 0)
  }

  const toggleCcp = () => {
    setIsCcpOpen((prev) => !prev)
  }

  const debouncedUpdateStep = useCallback(
    debounce((index: number, updates: Partial<ProductionStep>) => {
      updateStep(index, updates)
    }, 300),
    []
  )

  return (
    <BaseStep
      title='Method of Production'
      description='Define the step-by-step production process with detailed instructions.'
      data={data as any}
      onChange={onChange}
      onNext={() => validateMethod() && onNext?.()}
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
            onClick={addStep}
            disabled={isLoading}
            className='bg-[linear-gradient(#e9e9e9,#e9e9e9_50%,#fff)] group w-auto inline-flex transition-all duration-300 overflow-visible rounded-md'
          >
            <div className='w-full h-full bg-[linear-gradient(to_top,#ececec,#fff)] overflow-hidden p-1 rounded-md hover:shadow-none duration-300'>
              <div className='w-full h-full text-xl gap-x-0.5 gap-y-0.5 justify-center text-white bg-green-500 group-hover:bg-green-600 duration-200 items-center text-[18px] font-medium gap-4 inline-flex overflow-hidden px-4 py-2 rounded-md group-hover:text-blue-600'>
                <IconPlus className='w-5 h-5' />
                <span>Add Step</span>
              </div>
            </div>
          </button>
        </div>

        <div className='space-y-8'>
          {data.productionMethod?.defaultFlow?.map((step: ProductionStep, index: number) => (
            <div
              key={step.id}
              className={`space-y-4 p-6 bg-github-canvas-subtle rounded-lg border border-gray-300 ${openStepIndex === index ? '' : 'hidden'}`}
            >
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
                  onChange={(e) => {
                    const updatedContent = e.target.value
                    updateStep(index, { content: updatedContent })
                  }}
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
                        value={step.time ?? 0}
                        onChange={(e) =>
                          debouncedUpdateStep(index, { time: parseInt(e.target.value) })
                        }
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

                <div
                  className={`border border-red-600 p-4 rounded-md ${isCcpOpen ? '' : 'hover:bg-red-600 cursor-pointer'}`}
                  onClick={!isCcpOpen ? toggleCcp : undefined}
                >
                  <div className='flex justify-between items-center'>
                    <button onClick={toggleCcp} className='flex items-center space-x-2'>
                      <span className='text-center w-full'>{isCcpOpen ? '' : 'Add CCP'}</span>
                      <IconPlus className={`w-4 h-4 transform ${isCcpOpen ? 'rotate-45' : ''}`} />
                    </button>
                    {isCcpOpen && (
                      <button onClick={toggleCcp} className='text-red-600'>
                        <IconX className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                  {isCcpOpen && (
                    <CriticalControlPoint
                      onAdd={(ccp) => {
                        addCcpToStep(step.id, ccp)
                        setIsCcpOpen(false) // Close after adding
                      }}
                    />
                  )}
                </div>

                {ccps
                  .filter((ccp) => ccp.stepId === step.id)
                  .map((ccp, ccpIndex) => (
                    <div
                      key={ccpIndex}
                      className='flex items-center justify-between p-2 bg-github-canvas-default border border-red-600 rounded-md'
                    >
                      <p className='text-sm'>{ccp.note}</p>
                      <button
                        onClick={() => setCcps((prev) => prev.filter((_, i) => i !== ccpIndex))}
                        className='text-red-600'
                      >
                        <IconX className='w-4 h-4' />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <button
            onClick={addStep}
            disabled={isLoading}
            className='bg-[linear-gradient(#e9e9e9,#e9e9e9_50%,#fff)] group w-auto inline-flex transition-all duration-300 overflow-visible rounded-md'
          >
            <div className='w-full h-full bg-[linear-gradient(to_top,#ececec,#fff)] overflow-hidden p-1 rounded-md hover:shadow-none duration-300'>
              <div className='w-full h-full text-xl gap-x-0.5 gap-y-0.5 justify-center text-white bg-green-500 group-hover:bg-green-600 duration-200 items-center text-[18px] font-medium gap-4 inline-flex overflow-hidden px-4 py-2 rounded-md group-hover:text-blue-600'>
                <IconPlus className='w-5 h-5' />
                <span>Add Step</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </BaseStep>
  )
}

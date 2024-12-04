'use client'

import { useState } from 'react'
import { useHaccp } from '@/hooks/useHaccp'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import {
  IconAlertCircle,
  IconLoader,
  IconPlus,
  IconX,
  IconAlertTriangle,
} from '@/components/ui/icons'
import { BaseStep } from './BaseStep'
import { RecipeData, HaccpStep, HaccpMonitoring } from '@/types/recipe'
import { StepComponentProps } from './index'

export function HaccpPlan({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateHaccpPlan } = useHaccp()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addHaccpStep = async () => {
    setError('')
    const newStep: HaccpStep = {
      step: '',
      hazards: [],
      controls: [],
      criticalLimits: [],
      monitoring: {
        what: '',
        how: '',
        when: '',
        who: '',
      },
      correctiveActions: [],
      verification: [],
      records: [],
    }

    const updates: Partial<RecipeData> = {
      haccpPlan: [...(data.haccpPlan || []), newStep],
    }

    try {
      onChange(updates)
      await updatePreview('haccp', updates)

      if (data.id && typeof data.id === 'string') {
        setIsLoading(true)
        await updateHaccpPlan(data.id, updates.haccpPlan || [])
      }
    } catch (err) {
      setError('Failed to add HACCP step')
      onChange({ haccpPlan: data.haccpPlan }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const updateHaccpStep = async (index: number, updates: Partial<HaccpStep>) => {
    setError('')
    const current = [...(data.haccpPlan || [])] as HaccpStep[]
    current[index] = { ...current[index], ...updates }

    const haccpUpdates: Partial<RecipeData> = { haccpPlan: current }

    try {
      onChange(haccpUpdates)
      await updatePreview('haccp', haccpUpdates)

      if (data.id && typeof data.id === 'string') {
        setIsLoading(true)
        await updateHaccpPlan(data.id, current)
      }
    } catch (err) {
      setError('Failed to update HACCP step')
      onChange({ haccpPlan: data.haccpPlan }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const removeHaccpStep = async (index: number) => {
    setError('')
    const updates = {
      haccpPlan: data.haccpPlan?.filter((_, i) => i !== index),
    }

    try {
      onChange(updates)
      await updatePreview('haccp', updates)

      if (data.id && typeof data.id === 'string') {
        setIsLoading(true)
        await updateHaccpPlan(data.id, updates.haccpPlan)
      }
    } catch (err) {
      setError('Failed to remove HACCP step')
      onChange({ haccpPlan: data.haccpPlan }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateHaccpPlan = () => {
    if (!data.haccpPlan?.length) {
      setError('At least one HACCP control point is required')
      return false
    }

    const invalidSteps = data.haccpPlan.filter(
      (step) =>
        !step.step ||
        !step.hazards.length ||
        !step.controls.length ||
        !step.monitoring.what ||
        !step.monitoring.how ||
        !step.monitoring.when ||
        !step.monitoring.who ||
        !step.correctiveActions.length
    )

    if (invalidSteps.length > 0) {
      setError('All HACCP control points must be completely filled out')
      return false
    }

    return true
  }

  const handleServingsChange = (value: string) => {
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue)) {
      onChange({ servings: numValue })
    }
  }

  return (
    <BaseStep
      title='HACCP Plan'
      description='Define critical control points and food safety measures.'
      data={data}
      onChange={onChange}
      onNext={() => validateHaccpPlan() && onNext()}
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
            <IconAlertTriangle className='w-5 h-5' />
            <span className='text-sm'>
              Ensure all critical control points are properly documented
            </span>
          </div>
          <button
            onClick={addHaccpStep}
            disabled={isLoading}
            className='flex items-center space-x-2 px-4 py-2 bg-github-success-emphasis 
                     text-white rounded-md disabled:opacity-50'
          >
            {isLoading ? (
              <IconLoader className='w-4 h-4 animate-spin' />
            ) : (
              <IconPlus className='w-4 h-4' />
            )}
            <span>Add Control Point</span>
          </button>
        </div>

        <div className='space-y-8'>
          {data.haccpPlan?.map((step: HaccpStep, index: number) => (
            <div key={index} className='space-y-4 p-6 bg-github-canvas-subtle rounded-lg'>
              <div className='flex justify-between'>
                <h3 className='text-lg font-medium text-github-fg-default'>
                  Control Point {index + 1}
                </h3>
                <button
                  onClick={() => removeHaccpStep(index)}
                  className='text-github-fg-muted hover:text-github-danger-fg'
                >
                  <IconX className='w-5 h-5' />
                </button>
              </div>

              {/* Step Description */}
              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-2'>
                  Process Step
                </label>
                <input
                  type='text'
                  value={step.step}
                  onChange={(e) => updateHaccpStep(index, { step: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  placeholder='Describe the process step'
                />
              </div>

              {/* Hazards */}
              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-2'>
                  Potential Hazards
                </label>
                <textarea
                  value={step.hazards.join('\n')}
                  onChange={(e) =>
                    updateHaccpStep(index, { hazards: e.target.value.split('\n').filter(Boolean) })
                  }
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  rows={3}
                  placeholder='List potential hazards (one per line)'
                />
              </div>

              {/* Controls */}
              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-2'>
                  Control Measures
                </label>
                <textarea
                  value={step.controls.join('\n')}
                  onChange={(e) =>
                    updateHaccpStep(index, { controls: e.target.value.split('\n').filter(Boolean) })
                  }
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  rows={3}
                  placeholder='List control measures (one per line)'
                />
              </div>

              {/* Monitoring */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-github-fg-default mb-2'>
                    What to Monitor
                  </label>
                  <input
                    type='text'
                    value={step.monitoring.what}
                    onChange={(e) =>
                      updateHaccpStep(index, {
                        monitoring: { ...step.monitoring, what: e.target.value },
                      })
                    }
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-github-fg-default mb-2'>
                    How to Monitor
                  </label>
                  <input
                    type='text'
                    value={step.monitoring.how}
                    onChange={(e) =>
                      updateHaccpStep(index, {
                        monitoring: { ...step.monitoring, how: e.target.value },
                      })
                    }
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-github-fg-default mb-2'>
                    When to Monitor
                  </label>
                  <input
                    type='text'
                    value={step.monitoring.when}
                    onChange={(e) =>
                      updateHaccpStep(index, {
                        monitoring: { ...step.monitoring, when: e.target.value },
                      })
                    }
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-github-fg-default mb-2'>
                    Who Monitors
                  </label>
                  <input
                    type='text'
                    value={step.monitoring.who}
                    onChange={(e) =>
                      updateHaccpStep(index, {
                        monitoring: { ...step.monitoring, who: e.target.value },
                      })
                    }
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  />
                </div>
              </div>

              {/* Corrective Actions */}
              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-2'>
                  Corrective Actions
                </label>
                <textarea
                  value={step.correctiveActions.join('\n')}
                  onChange={(e) =>
                    updateHaccpStep(index, {
                      correctiveActions: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  rows={3}
                  placeholder='List corrective actions (one per line)'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseStep>
  )
}

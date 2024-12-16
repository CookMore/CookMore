'use client'

import { useState } from 'react'
import { IconGripVertical, IconPlus, IconX, IconCamera, IconTrash } from '@/components/ui/icons'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { RecipeData } from '@/app/api/types/recipe'
import { StepComponentProps } from './index'

interface Step {
  type: 'prep' | 'cook'
  content: string
  image?: string
  time?: number
  timeUnit?: 'minutes' | 'hours'
}

interface Equipment {
  item: string
  optional: boolean
}

export function Instructions({ data, onChange, onNext, onBack }: StepComponentProps) {
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null)
  const [newStep, setNewStep] = useState<Step>({
    type: 'prep',
    content: '',
    time: undefined,
    timeUnit: 'minutes',
  })
  const [newEquipment, setNewEquipment] = useState<Equipment>({ item: '', optional: false })

  const addStep = () => {
    onChange({
      steps: [...(data.steps || []), { ...newStep }],
    })
    setNewStep({
      type: 'prep',
      content: '',
      time: undefined,
      timeUnit: 'minutes',
    })
  }

  const removeStep = (index: number) => {
    const steps = [...(data.steps || [])]
    onChange({
      steps: steps.filter((_, i) => i !== index),
    })
  }

  const updateStep = (index: number, updates: Partial<Step>) => {
    const updatedSteps = [...(data.steps || [])]
    updatedSteps[index] = { ...(updatedSteps[index] || {}), ...updates }
    onChange({ steps: updatedSteps })
  }

  const addEquipment = () => {
    if (!newEquipment.item) return
    onChange({
      equipment: [...(data.equipment || []), { ...newEquipment }],
    })
    setNewEquipment({ item: '', optional: false })
  }

  const removeEquipment = (index: number) => {
    const equipment = [...(data.equipment || [])]
    onChange({
      equipment: equipment.filter((_, i) => i !== index),
    })
  }

  return (
    <div className='space-y-6'>
      {/* Equipment Section */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-github-fg-default'>Equipment Needed</h3>

        {/* New Equipment Form */}
        <div className='flex items-center space-x-2'>
          <input
            type='text'
            value={newEquipment.item}
            onChange={(e) => setNewEquipment((prev) => ({ ...prev, item: e.target.value }))}
            className='flex-1 px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
            placeholder='Add equipment...'
          />
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={newEquipment.optional}
              onChange={(e) => setNewEquipment((prev) => ({ ...prev, optional: e.target.checked }))}
              className='accent-github-success-emphasis'
            />
            <span className='text-sm text-github-fg-muted'>Optional</span>
          </label>
          <button
            onClick={addEquipment}
            className='px-3 py-2 bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90'
          >
            <IconPlus className='w-4 h-4' />
          </button>
        </div>

        {/* Equipment List */}
        <div className='space-y-2'>
          {data.equipment?.map((item, index) => (
            <div
              key={index}
              className='flex justify-between items-center bg-github-canvas-subtle p-2 rounded-md'
            >
              <div className='flex items-center space-x-2'>
                <IconGripVertical className='w-4 h-4 text-github-fg-muted cursor-move' />
                <span className='text-sm'>{item.item}</span>
                {item.optional && <span className='text-xs text-github-fg-muted'>(Optional)</span>}
              </div>
              <button
                onClick={() => removeEquipment(index)}
                className='text-github-danger-fg hover:text-github-danger-emphasis'
              >
                <IconX className='w-4 h-4' />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions Steps */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-github-fg-default'>Instructions</h3>

        {/* New Step Form */}
        <div className='space-y-3'>
          <div className='flex items-center space-x-2'>
            <select
              value={newStep.type}
              onChange={(e) =>
                setNewStep((prev) => ({ ...prev, type: e.target.value as 'prep' | 'cook' }))
              }
              className='px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
            >
              <option value='prep'>Prep Step</option>
              <option value='cook'>Cooking Step</option>
            </select>
            {newStep.type === 'cook' && (
              <div className='flex items-center space-x-2'>
                <input
                  type='number'
                  value={newStep.time || ''}
                  onChange={(e) =>
                    setNewStep((prev) => ({ ...prev, time: Number(e.target.value) }))
                  }
                  className='w-20 px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  placeholder='Time'
                  min='0'
                />
                <select
                  value={newStep.timeUnit}
                  onChange={(e) =>
                    setNewStep((prev) => ({
                      ...prev,
                      timeUnit: e.target.value as 'minutes' | 'hours',
                    }))
                  }
                  className='px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                >
                  <option value='minutes'>minutes</option>
                  <option value='hours'>hours</option>
                </select>
              </div>
            )}
          </div>

          <div className='flex space-x-2'>
            <textarea
              value={newStep.content}
              onChange={(e) => setNewStep((prev) => ({ ...prev, content: e.target.value }))}
              className='flex-1 px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              rows={2}
              placeholder='Describe this step...'
            />
            <button onClick={addStep}>
              <IconPlus className='w-4 h-4' />
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className='space-y-4'>
          {data.steps?.map((step, index) => (
            <div key={index} className='bg-github-canvas-subtle p-4 rounded-md space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <IconGripVertical className='w-4 h-4 text-github-fg-muted cursor-move' />
                  <span className='text-sm font-medium'>
                    {step.type === 'prep' ? '🔪 Prep' : '👩‍🍳 Cook'}
                  </span>
                  {step.time && (
                    <span className='text-sm text-github-fg-muted'>
                      ({step.time} {step.timeUnit})
                    </span>
                  )}
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => setActiveUploadIndex(index)}
                    className='text-github-fg-muted hover:text-github-fg-default'
                  >
                    <IconCamera className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => removeStep(index)}
                    className='text-github-danger-fg hover:text-github-danger-emphasis'
                  >
                    <IconTrash className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <p className='text-sm text-github-fg-default'>{step.content}</p>

              {/* Step Image */}
              {step.image && (
                <div className='relative group'>
                  <img
                    src={step.image}
                    alt={`Step ${index + 1}`}
                    className='w-full h-48 object-cover rounded-md'
                  />
                  <button
                    onClick={() => updateStep(index, { image: undefined })}
                    className='absolute top-2 right-2 p-1 bg-github-danger-emphasis text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <IconX className='w-4 h-4' />
                  </button>
                </div>
              )}

              {/* Image Upload Modal */}
              {activeUploadIndex === index && (
                <ImageUpload
                  onUpload={(url) => {
                    updateStep(index, { image: url })
                    setActiveUploadIndex(null)
                  }}
                  onClose={() => setActiveUploadIndex(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className='flex justify-between'>
        <button
          onClick={onBack}
          className='px-4 py-2 text-github-fg-default bg-github-canvas-subtle rounded-md hover:bg-github-canvas-default'
        >
          Back
        </button>
        <button
          onClick={onNext}
          className='px-4 py-2 bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90'
        >
          Next: Media
        </button>
      </div>
    </div>
  )
}

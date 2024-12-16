'use client'

import { useState } from 'react'
import { useEquipment } from '@/app/(authenticated)/kitchen/hooks'
import { useRecipePreview } from '@/app/api/hooks/useRecipePreview'
import {
  IconAlertCircle,
  IconLoader,
  IconPlus,
  IconX,
  IconGripVertical,
} from '@/components/ui/icons'
import { BaseStep } from './BaseStep'
import { RecipeData } from '@/app/api/types/recipe'
import { StepComponentProps } from './index'

export function Equipment({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateEquipmentList } = useEquipment()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const addEquipment = async () => {
    setError('')
    const newEquipment = {
      item: '',
      optional: false,
      quantity: 1,
      notes: '',
    }

    const updates = {
      equipment: [...(data.equipment || []), newEquipment],
    }

    try {
      onChange(updates)
      await updatePreview('equipment', updates)

      if (data.id) {
        setIsLoading(true)
        await updateEquipmentList(data.id, updates.equipment)
      }
    } catch (err) {
      setError('Failed to add equipment')
      onChange({ equipment: data.equipment }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const removeEquipment = async (index: number) => {
    setError('')
    const updates = {
      equipment: data.equipment?.filter((_, i) => i !== index),
    }

    try {
      onChange(updates)
      await updatePreview('equipment', updates)

      if (data.id) {
        setIsLoading(true)
        await updateEquipmentList(data.id, updates.equipment)
      }
    } catch (err) {
      setError('Failed to remove equipment')
      onChange({ equipment: data.equipment }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const updateEquipment = async (index: number, updates: Partial<RecipeData['equipment'][0]>) => {
    setError('')
    const current = [...(data.equipment || [])]
    current[index] = { ...current[index], ...updates }

    const equipmentUpdates = { equipment: current }

    try {
      onChange(equipmentUpdates)
      await updatePreview('equipment', equipmentUpdates)

      if (data.id) {
        setIsLoading(true)
        await updateEquipmentList(data.id, current)
      }
    } catch (err) {
      setError('Failed to update equipment')
      onChange({ equipment: data.equipment }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateEquipment = () => {
    if (!data.equipment?.length) {
      setError('At least one piece of equipment is required')
      return false
    }
    if (data.equipment.some((item) => !item.item.trim())) {
      setError('All equipment items must have a name')
      return false
    }
    return true
  }

  return (
    <BaseStep
      title='Equipment & Tools'
      description='List all equipment and tools needed for this recipe.'
      data={data}
      onChange={onChange}
      onNext={() => validateEquipment() && onNext()}
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
            onClick={addEquipment}
            disabled={isLoading}
            className='flex items-center space-x-2 px-4 py-2 bg-github-success-emphasis 
                     text-white rounded-md disabled:opacity-50'
          >
            {isLoading ? (
              <IconLoader className='w-4 h-4 animate-spin' />
            ) : (
              <IconPlus className='w-4 h-4' />
            )}
            <span>Add Equipment</span>
          </button>
        </div>

        <div className='space-y-4'>
          {data.equipment?.map((item, index) => (
            <div
              key={index}
              className='flex items-start space-x-4 p-4 bg-github-canvas-subtle rounded-md'
            >
              <IconGripVertical className='w-5 h-5 mt-2 text-github-fg-muted cursor-move' />

              <div className='flex-1 grid grid-cols-12 gap-4'>
                <div className='col-span-2'>
                  <input
                    type='number'
                    value={item.quantity}
                    onChange={(e) => updateEquipment(index, { quantity: parseInt(e.target.value) })}
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                    min='1'
                  />
                </div>

                <div className='col-span-4'>
                  <input
                    type='text'
                    value={item.item}
                    onChange={(e) => updateEquipment(index, { item: e.target.value })}
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                    placeholder='Equipment name'
                  />
                </div>

                <div className='col-span-4'>
                  <input
                    type='text'
                    value={item.notes}
                    onChange={(e) => updateEquipment(index, { notes: e.target.value })}
                    className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                    placeholder='Notes (optional)'
                  />
                </div>

                <div className='col-span-1 flex items-center'>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={item.optional}
                      onChange={(e) => updateEquipment(index, { optional: e.target.checked })}
                      className='rounded border-github-border-default text-github-accent-emphasis'
                    />
                    <span className='text-sm text-github-fg-muted'>Optional</span>
                  </label>
                </div>

                <div className='col-span-1 flex justify-end'>
                  <button
                    onClick={() => removeEquipment(index)}
                    className='text-github-fg-muted hover:text-github-danger-fg'
                  >
                    <IconX className='w-5 h-5' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseStep>
  )
}

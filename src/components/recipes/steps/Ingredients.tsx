'use client'

import { useState } from 'react'
import { useIngredients } from '@/hooks/useIngredients'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import {
  IconAlertCircle,
  IconLoader,
  IconGripVertical,
  IconX,
  IconPlus,
} from '@/components/ui/icons'
import { BaseStep } from './BaseStep'
import { RecipeData } from '@/types/recipe'
import { StepComponentProps } from './index'

interface Props extends StepComponentProps {
  isActive: boolean
}

export function Ingredients({ data, onChange, onNext, onBack, isActive }: Props) {
  const { updateIngredientsList } = useIngredients()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [newIngredient, setNewIngredient] = useState({
    amount: '',
    unit: '',
    item: '',
    notes: '',
  })

  if (!isActive) return null

  const addIngredient = async () => {
    if (!newIngredient.item) {
      setError('Ingredient name is required')
      return
    }
    setError('')

    const updates = {
      ingredients: [...(data.ingredients || []), newIngredient],
    }

    try {
      onChange(updates)
      await updatePreview('ingredients', updates)

      if (data.id) {
        setIsLoading(true)
        await updateIngredientsList(data.id, updates.ingredients, data.ingredientGroups || [])
      }
      setNewIngredient({ amount: '', unit: '', item: '', notes: '' })
    } catch (err) {
      setError('Failed to add ingredient')
      onChange({ ingredients: data.ingredients }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const removeIngredient = async (index: number) => {
    setError('')
    const updates = {
      ingredients: data.ingredients.filter((_, i) => i !== index),
    }

    try {
      onChange(updates)
      await updatePreview('ingredients', updates)

      if (data.id) {
        setIsLoading(true)
        await updateIngredientsList(data.id, updates.ingredients, data.ingredientGroups || [])
      }
    } catch (err) {
      setError('Failed to remove ingredient')
      onChange({ ingredients: data.ingredients }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const updateIngredient = async (index: number, field: string, value: string) => {
    setError('')
    const updatedIngredients = [...data.ingredients]
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    }

    const updates = { ingredients: updatedIngredients }

    try {
      onChange(updates)
      await updatePreview('ingredients', updates)

      if (data.id) {
        setIsLoading(true)
        await updateIngredientsList(data.id, updatedIngredients, data.ingredientGroups || [])
      }
    } catch (err) {
      setError('Failed to update ingredient')
      onChange({ ingredients: data.ingredients }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const addIngredientGroup = async () => {
    setError('')
    const updates = {
      ingredientGroups: [...(data.ingredientGroups || []), { name: '', ingredients: [] }],
    }

    try {
      onChange(updates)
      await updatePreview('ingredientGroups', updates)

      if (data.id) {
        setIsLoading(true)
        await updateIngredientsList(data.id, data.ingredients || [], updates.ingredientGroups)
      }
    } catch (err) {
      setError('Failed to add ingredient group')
      onChange({ ingredientGroups: data.ingredientGroups }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateIngredients = () => {
    if (!data.ingredients?.length) {
      setError('At least one ingredient is required')
      return false
    }
    if (data.ingredients.some((ing) => !ing.item.trim())) {
      setError('All ingredients must have a name')
      return false
    }
    return true
  }

  const units = [
    'g',
    'kg',
    'oz',
    'lb',
    'ml',
    'l',
    'tsp',
    'tbsp',
    'cup',
    'pint',
    'quart',
    'gallon',
    'piece',
    'whole',
    'pinch',
    'to taste',
  ]

  return (
    <BaseStep
      title='Recipe Ingredients'
      description='List all ingredients needed for your recipe, including amounts and units.'
      data={data}
      onChange={onChange}
      onNext={() => validateIngredients() && onNext?.()}
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
        {/* Ingredient Groups */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-github-fg-default'>Ingredients</h3>
            <button
              onClick={addIngredientGroup}
              className='text-sm text-github-accent-fg hover:underline flex items-center space-x-1'
            >
              <IconPlus className='w-3 h-3' />
              <span>Add Group</span>
            </button>
          </div>

          {/* New Ingredient Form */}
          <div className='grid grid-cols-12 gap-2 items-start'>
            <div className='col-span-2'>
              <input
                type='text'
                value={newIngredient.amount}
                onChange={(e) => setNewIngredient((prev) => ({ ...prev, amount: e.target.value }))}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                         rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                         focus:ring-github-accent-emphasis'
                placeholder='Amount'
              />
            </div>
            <div className='col-span-2'>
              <select
                value={newIngredient.unit}
                onChange={(e) => setNewIngredient((prev) => ({ ...prev, unit: e.target.value }))}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                         rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                         focus:ring-github-accent-emphasis'
              >
                <option value=''>Unit</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-span-4'>
              <input
                type='text'
                value={newIngredient.item}
                onChange={(e) => setNewIngredient((prev) => ({ ...prev, item: e.target.value }))}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                         rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                         focus:ring-github-accent-emphasis'
                placeholder='Ingredient'
              />
            </div>
            <div className='col-span-3'>
              <input
                type='text'
                value={newIngredient.notes}
                onChange={(e) => setNewIngredient((prev) => ({ ...prev, notes: e.target.value }))}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                         rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                         focus:ring-github-accent-emphasis'
                placeholder='Notes (optional)'
              />
            </div>
            <div className='col-span-1'>
              <button
                onClick={addIngredient}
                className='w-full px-3 py-2 bg-github-success-emphasis text-white rounded-md 
                         hover:bg-github-success-emphasis/90 focus:outline-none focus:ring-2 
                         focus:ring-github-accent-emphasis'
              >
                {isLoading ? (
                  <IconLoader className='w-4 h-4 animate-spin' />
                ) : (
                  <IconPlus className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>

          {/* Ingredient List */}
          <div className='space-y-2'>
            {data.ingredients?.map((ingredient, index) => (
              <div
                key={index}
                className='grid grid-cols-12 gap-2 items-center bg-github-canvas-subtle p-2 rounded-md'
              >
                <div className='col-span-1'>
                  <IconGripVertical className='w-4 h-4 text-github-fg-muted cursor-move' />
                </div>
                <div className='col-span-2'>
                  <input
                    type='text'
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    className='w-full px-2 py-1 text-sm bg-github-canvas-default border border-github-border-default rounded-md'
                  />
                </div>
                <div className='col-span-2'>
                  <select
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className='w-full px-2 py-1 text-sm bg-github-canvas-default border border-github-border-default rounded-md'
                  >
                    <option value=''>Unit</option>
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='col-span-4'>
                  <input
                    type='text'
                    value={ingredient.item}
                    onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                    className='w-full px-2 py-1 text-sm bg-github-canvas-default border border-github-border-default rounded-md'
                  />
                </div>
                <div className='col-span-2'>
                  <input
                    type='text'
                    value={ingredient.notes || ''}
                    onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                    className='w-full px-2 py-1 text-sm bg-github-canvas-default border border-github-border-default rounded-md'
                    placeholder='Notes'
                    title={ingredient.notes}
                  />
                </div>
                <div className='col-span-1'>
                  <button
                    onClick={() => removeIngredient(index)}
                    className='text-github-danger-fg hover:text-github-danger-emphasis'
                  >
                    <IconX className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseStep>
  )
}

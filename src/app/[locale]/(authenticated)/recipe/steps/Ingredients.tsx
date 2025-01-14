'use client'

import { useState } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { IconAlertCircle, IconLoader, IconGripVertical, IconX, IconPlus } from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'
import { useRecipePreview } from '@/app/[locale]/(authenticated)/recipe/hooks/useRecipePreview'

interface Props extends StepComponentProps {
  isActive: boolean
}

export function Ingredients({ onNext, onBack, isActive }: Props) {
  const { state, updateRecipe } = useRecipe()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [newIngredient, setNewIngredient] = useState({
    amount: '',
    unit: '',
    item: '',
    notes: '',
  })
  const [showDeletePopover, setShowDeletePopover] = useState<number | null>(null)

  if (!isActive) return null

  const handleIngredientChange = (updates: Partial<typeof state.recipeData>) => {
    setError('')
    updateRecipe(updates)
    updatePreview('ingredients', updates)
  }

  const addIngredient = () => {
    if (!newIngredient.item) {
      setError('Ingredient name is required')
      return
    }
    handleIngredientChange({
      ingredients: [...(state.recipeData.ingredients || []), newIngredient],
    })
    setNewIngredient({ amount: '', unit: '', item: '', notes: '' })
  }

  const removeIngredient = (index: number) => {
    handleIngredientChange({
      ingredients: state.recipeData.ingredients?.filter((_, i) => i !== index),
    })
  }

  const updateIngredient = (index: number, field: string, value: string) => {
    const updatedIngredients = [...(state.recipeData.ingredients || [])]
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    }
    handleIngredientChange({ ingredients: updatedIngredients })
  }

  const addIngredientGroup = () => {
    handleIngredientChange({
      ingredientGroups: [
        ...(state.recipeData.ingredientGroups || []),
        { name: '', ingredients: [] },
      ],
    })
  }

  const confirmDeleteGroup = (groupIndex: number) => {
    setShowDeletePopover(groupIndex)
  }

  const handleDeleteGroup = (groupIndex: number, keepItems: boolean) => {
    const groupToRemove = state.recipeData.ingredientGroups?.[groupIndex]
    const remainingGroups = state.recipeData.ingredientGroups?.filter((_, i) => i !== groupIndex)
    const updatedIngredients = keepItems
      ? [...(state.recipeData.ingredients || []), ...(groupToRemove?.ingredients || [])]
      : state.recipeData.ingredients
    handleIngredientChange({
      ingredientGroups: remainingGroups,
      ingredients: updatedIngredients,
    })
    setShowDeletePopover(null)
  }

  const addIngredientToGroup = (groupIndex: number) => {
    const updatedGroups = [...(state.recipeData.ingredientGroups || [])]
    const newIngredient = { amount: '', unit: '', item: '', notes: '' }
    updatedGroups[groupIndex] = {
      ...updatedGroups[groupIndex],
      ingredients: [...updatedGroups[groupIndex].ingredients, newIngredient],
    }
    handleIngredientChange({ ingredientGroups: updatedGroups })
  }

  const validateIngredients = () => {
    if (!state.recipeData.ingredients?.length) {
      setError('At least one ingredient is required')
      return false
    }
    if (state.recipeData.ingredients.some((ing) => !ing.item.trim())) {
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

  const updateGroupName = (groupIndex: number, name: string) => {
    const updatedGroups = [...(state.recipeData.ingredientGroups || [])]
    updatedGroups[groupIndex] = { ...updatedGroups[groupIndex], name }
    handleIngredientChange({ ingredientGroups: updatedGroups })
  }

  return (
    <BaseStep
      title='Recipe Ingredients'
      description='List all ingredients needed for your recipe, including amounts and units.'
      data={state.recipeData}
      onChange={updateRecipe}
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

          {state.recipeData.ingredientGroups?.map((group: any, groupIndex: number) => (
            <div key={groupIndex} className='bg-github-canvas-subtle p-4 rounded-md'>
              <div className='flex justify-between items-center mb-2'>
                <input
                  type='text'
                  value={group.name}
                  onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default placeholder-github-fg-muted'
                  placeholder='Group Name'
                />
                <button
                  onClick={() => confirmDeleteGroup(groupIndex)}
                  className='text-github-danger-fg hover:text-github-danger-emphasis'
                >
                  <IconX className='w-4 h-4' />
                </button>
              </div>
              {showDeletePopover === groupIndex && (
                <div className='p-4 bg-white border border-gray-300 rounded-md shadow-md'>
                  <p className='text-sm mb-2'>
                    This group contains items. What would you like to do?
                  </p>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleDeleteGroup(groupIndex, true)}
                      className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                    >
                      Keep Items
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(groupIndex, false)}
                      className='px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600'
                    >
                      Delete Items
                    </button>
                  </div>
                </div>
              )}
              <div className='space-y-2'>
                {group.ingredients.map((ingredient, index) => (
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
                <button
                  onClick={() => addIngredientToGroup(groupIndex)}
                  className='text-sm text-github-accent-fg hover:underline flex items-center space-x-1'
                >
                  <IconPlus className='w-3 h-3' />
                  <span>Add Ingredient</span>
                </button>
              </div>
            </div>
          ))}

          <div className='grid grid-cols-12 gap-2 items-start'>
            <div className='col-span-2'>
              <input
                type='text'
                value={newIngredient.amount}
                onChange={(e) => setNewIngredient((prev) => ({ ...prev, amount: e.target.value }))}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis'
                placeholder='Amount'
              />
            </div>
            <div className='col-span-2'>
              <select
                value={newIngredient.unit}
                onChange={(e) => setNewIngredient((prev) => ({ ...prev, unit: e.target.value }))}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis'
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
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis'
                placeholder='Ingredient'
              />
            </div>
            <div className='col-span-3'>
              <input
                type='text'
                value={newIngredient.notes}
                onChange={(e) => setNewIngredient((prev) => ({ ...prev, notes: e.target.value }))}
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis'
                placeholder='Notes (optional)'
              />
            </div>
            <div className='col-span-1'>
              <button
                onClick={addIngredient}
                className='w-full px-3 py-2 bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90 focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis'
              >
                {isLoading ? (
                  <IconLoader className='w-4 h-4 animate-spin' />
                ) : (
                  <IconPlus className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>

          <div className='space-y-2'>
            {state.recipeData.ingredients?.map((ingredient, index) => (
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

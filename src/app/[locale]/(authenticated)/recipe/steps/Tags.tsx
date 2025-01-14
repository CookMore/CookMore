'use client'

import { useState } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { useTags } from '@/app/[locale]/(authenticated)/recipe/hooks/useTags'
import { IconAlertCircle, IconSpinner } from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'

const categories = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Appetizer',
  // ... add other categories
] as const

const cuisines = [
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  // ... add other cuisines
] as const

const occasions = [
  'Birthday',
  'Holiday',
  'Wedding',
  'Casual',
  'Party',
  // ... add other occasions
] as const

export function Tags({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const { updateTags } = useTags()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleTagUpdate = async (updates: Partial<RecipeData>) => {
    setError('')
    try {
      updateRecipe(updates)
      if (state.recipeData.id) {
        setIsLoading(true)
        await updateTags(Number(state.recipeData.id), updates)
      }
    } catch (err) {
      setError('Failed to update tags')
    } finally {
      setIsLoading(false)
    }
  }

  const validateTags = () => {
    if (
      !state.recipeData.categories?.length &&
      !state.recipeData.cuisines?.length &&
      !state.recipeData.occasions?.length &&
      !state.recipeData.customTags?.length
    ) {
      setError('Please select at least one tag')
      return false
    }
    return true
  }

  return (
    <BaseStep
      title='Tags'
      description='Categorize your recipe to make it easier to find.'
      data={state.recipeData}
      onChange={updateRecipe}
      onNext={() => validateTags() && onNext()}
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
        {/* Categories */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>
            Categories
            <span className='text-github-danger-fg ml-1'>*</span>
          </h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            {categories.map((category) => (
              <label key={category} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={state.recipeData.categories?.includes(category) || false}
                  disabled={isLoading}
                  onChange={(e) => {
                    const current = state.recipeData.categories || []
                    handleTagUpdate({
                      categories: e.target.checked
                        ? [...current, category]
                        : current.filter((c) => c !== category),
                    })
                  }}
                  className='accent-github-success-emphasis disabled:opacity-50'
                />
                <span className='text-sm text-github-fg-default'>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cuisine Type */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Cuisine</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            {cuisines.map((cuisine) => (
              <label key={cuisine} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={state.recipeData.cuisines?.includes(cuisine) || false}
                  disabled={isLoading}
                  onChange={(e) => {
                    const current = state.recipeData.cuisines || []
                    handleTagUpdate({
                      cuisines: e.target.checked
                        ? [...current, cuisine]
                        : current.filter((c) => c !== cuisine),
                    })
                  }}
                  className='accent-github-success-emphasis disabled:opacity-50'
                />
                <span className='text-sm text-github-fg-default'>{cuisine}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Occasions */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Occasions</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            {occasions.map((occasion) => (
              <label key={occasion} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={state.recipeData.occasions?.includes(occasion) || false}
                  disabled={isLoading}
                  onChange={(e) => {
                    const current = state.recipeData.occasions || []
                    handleTagUpdate({
                      occasions: e.target.checked
                        ? [...current, occasion]
                        : current.filter((o) => o !== occasion),
                    })
                  }}
                  className='accent-github-success-emphasis disabled:opacity-50'
                />
                <span className='text-sm text-github-fg-default'>{occasion}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Tags */}
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Custom Tags</h3>
          <input
            type='text'
            placeholder='Add tags separated by commas'
            className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
            value={state.recipeData.customTags?.join(', ') || ''}
            onChange={(e) => {
              const tags = e.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)
              handleTagUpdate({ customTags: tags })
            }}
          />
        </div>

        {/* Navigation */}
        <div className='flex justify-between'>
          <button
            onClick={onBack}
            disabled={isLoading}
            className='px-4 py-2 text-github-fg-default bg-github-canvas-subtle 
                     rounded-md hover:bg-github-canvas-default disabled:opacity-50'
          >
            Back
          </button>
          <button
            onClick={() => validateTags() && onNext()}
            disabled={isLoading}
            className='flex items-center space-x-2 px-4 py-2 bg-github-success-emphasis 
                     text-white rounded-md hover:bg-github-success-emphasis/90 
                     disabled:opacity-50'
          >
            {isLoading ? <IconSpinner className='w-4 h-4 animate-spin' /> : null}
            <span>Next: Review</span>
          </button>
        </div>
      </div>
    </BaseStep>
  )
}

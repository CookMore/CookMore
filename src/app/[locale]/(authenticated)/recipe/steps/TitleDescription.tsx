'use client'

import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'

export function TitleDescription({
  onNext,
  onBack,
  errors = {},
}: StepComponentProps & { errors: Record<string, string[]> }) {
  const { state, updateRecipe } = useRecipe()

  return (
    <BaseStep
      title='Recipe Title & Description'
      description='Start with a clear, descriptive title and provide an overview of your recipe.'
      onChange={updateRecipe}
      onNext={onNext}
      onBack={onBack}
      isValid={!errors.title?.length && !errors.description?.length}
    >
      <div className='space-y-4'>
        <div>
          <label htmlFor='title' className='block text-sm font-medium text-github-fg-default mb-2'>
            Title
          </label>
          <input
            id='title'
            type='text'
            value={state.recipeData?.title || ''}
            onChange={(e) => updateRecipe({ title: e.target.value })}
            className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                     rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                     focus:ring-github-accent-emphasis'
            placeholder='Enter recipe title'
          />
          {errors.title && <p className='text-red-500 text-sm'>{errors.title.join(', ')}</p>}
          <div className='flex justify-between mt-1'></div>
        </div>

        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-github-fg-default mb-2'
          >
            Description
          </label>
          <textarea
            id='description'
            value={state.recipeData?.description || ''}
            onChange={(e) => updateRecipe({ description: e.target.value })}
            rows={4}
            className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                     rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                     focus:ring-github-accent-emphasis'
            placeholder='Describe your recipe'
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.join(', ')}</p>
          )}
          <div className='flex justify-between mt-1'></div>
        </div>
      </div>
    </BaseStep>
  )
}

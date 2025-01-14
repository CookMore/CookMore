'use client'

import { useState } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { IconPlus, IconX, IconLink, IconImage, IconLoader } from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/

export function Inspiration({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const [sourceInput, setSourceInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateUrl = (url: string) => {
    return URL_REGEX.test(url)
  }

  const addInspiration = (type: string, value: string) => {
    if (!value.trim()) return
    setError('')

    if (type === 'sources' && value.startsWith('http')) {
      if (!validateUrl(value)) {
        setError('Please enter a valid URL')
        return
      }

      setIsLoading(true)
      const current = state.recipeData.inspiration?.[type] || []
      const updates = {
        inspiration: {
          ...state.recipeData.inspiration,
          [type]: [...current, value.trim()],
        },
      }

      updateRecipe(updates)
      setIsLoading(false)
    }
    setSourceInput('')
  }

  const removeInspiration = (type: string, index: number) => {
    const current = state.recipeData.inspiration?.[type] || []
    updateRecipe({
      inspiration: {
        ...state.recipeData.inspiration,
        [type]: current.filter((_, i) => i !== index),
      },
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const imageUrl = URL.createObjectURL(file)
    const updates = {
      inspiration: {
        ...state.recipeData.inspiration,
        images: [...(state.recipeData.inspiration?.images || []), imageUrl],
      },
    }

    updateRecipe(updates)
    setIsLoading(false)
  }

  return (
    <BaseStep
      title='Inspiration'
      description='Share what inspired this recipe and credit your influences.'
      data={state.recipeData}
      onChange={updateRecipe}
      onNext={onNext}
      onBack={onBack}
      isValid={!error}
    >
      <div className='space-y-6'>
        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Sources & References</h3>
          <div className='space-y-2'>
            <div className='relative'>
              <input
                type='text'
                value={sourceInput}
                onChange={(e) => setSourceInput(e.target.value)}
                placeholder='Add a source or reference URL'
                className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis pl-10'
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addInspiration('sources', sourceInput)
                  }
                }}
              />
              <IconLink className='absolute left-3 top-2.5 w-4 h-4 text-github-fg-muted' />
              {isLoading && (
                <IconLoader className='absolute right-3 top-2.5 w-4 h-4 animate-spin text-github-fg-muted' />
              )}
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
            <div className='flex flex-wrap gap-2'>
              {state.recipeData.inspiration?.sources?.map((source, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 px-2 py-1 bg-github-canvas-subtle rounded-md text-sm text-github-fg-default'
                >
                  <span>{source}</span>
                  <button
                    onClick={() => removeInspiration('sources', index)}
                    className='text-github-fg-muted hover:text-github-danger-fg'
                  >
                    <IconX className='w-4 h-4' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Inspiration Images</h3>
          <div className='space-y-2'>
            <label className='flex items-center justify-center w-full h-32 border-2 border-dashed border-github-border-default rounded-md cursor-pointer hover:border-github-accent-emphasis'>
              <input type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
              <div className='flex flex-col items-center space-y-2'>
                <IconImage className='w-8 h-8 text-github-fg-muted' />
                <span className='text-sm text-github-fg-muted'>Upload inspiration images</span>
              </div>
            </label>
            <div className='grid grid-cols-2 gap-4'>
              {state.recipeData.inspiration?.images?.map((image, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={image}
                    alt={`Inspiration ${index + 1}`}
                    className='w-full h-32 object-cover rounded-md'
                  />
                  <button
                    onClick={() => removeInspiration('images', index)}
                    className='absolute top-2 right-2 p-1 bg-github-canvas-default rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <IconX className='w-4 h-4 text-github-danger-fg' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-sm font-medium text-github-fg-default'>Inspiration Notes</h3>
          <textarea
            rows={4}
            placeholder='Share any additional thoughts or inspiration...'
            className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis'
            value={state.recipeData.inspiration?.notes || ''}
            onChange={(e) =>
              updateRecipe({
                inspiration: {
                  ...state.recipeData.inspiration,
                  notes: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
    </BaseStep>
  )
}

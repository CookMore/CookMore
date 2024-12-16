'use client'

import { useState, useEffect } from 'react'
import { BaseStep } from './BaseStep'
import { RecipeData } from '@/app/api/types/recipe'
import { useChangeLog } from '@/app/api/hooks/useChangeLog'
import { StepComponentProps } from './index'

const TITLE_LIMIT = 100
const DESCRIPTION_LIMIT = 500

export function TitleDescription({ data, onChange, onNext }: StepComponentProps) {
  const { logChange } = useChangeLog()
  const [errors, setErrors] = useState({ title: '', description: '' })

  const validateInputs = () => {
    const newErrors = {
      title: '',
      description: '',
    }

    if (!data.title) {
      newErrors.title = 'Title is required'
    } else if (data.title.length > TITLE_LIMIT) {
      newErrors.title = `Title must be less than ${TITLE_LIMIT} characters`
    }

    if (data.description && data.description.length > DESCRIPTION_LIMIT) {
      newErrors.description = `Description must be less than ${DESCRIPTION_LIMIT} characters`
    }

    setErrors(newErrors)
    return !newErrors.title && !newErrors.description
  }

  useEffect(() => {
    validateInputs()
  }, [data.title, data.description])

  return (
    <BaseStep
      title='Recipe Title & Description'
      description='Start with a clear, descriptive title and provide an overview of your recipe.'
      onNext={() => validateInputs() && onNext()}
      isValid={!errors.title && !errors.description}
    >
      <div className='space-y-4'>
        <div>
          <label htmlFor='title' className='block text-sm font-medium text-github-fg-default mb-2'>
            Title
          </label>
          <input
            id='title'
            type='text'
            value={data.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                     rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                     focus:ring-github-accent-emphasis'
            placeholder='Enter recipe title'
          />
          <div className='flex justify-between mt-1'>
            {errors.title && <span className='text-sm text-red-500'>{errors.title}</span>}
            <span className='text-sm text-github-fg-muted'>
              {data.title?.length || 0}/{TITLE_LIMIT}
            </span>
          </div>
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
            value={data.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={4}
            className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                     rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                     focus:ring-github-accent-emphasis'
            placeholder='Describe your recipe'
          />
          <div className='flex justify-between mt-1'>
            {errors.description && (
              <span className='text-sm text-red-500'>{errors.description}</span>
            )}
            <span className='text-sm text-github-fg-muted'>
              {data.description?.length || 0}/{DESCRIPTION_LIMIT}
            </span>
          </div>
        </div>
      </div>
    </BaseStep>
  )
}

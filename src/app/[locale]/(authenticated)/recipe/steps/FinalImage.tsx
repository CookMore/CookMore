'use client'

import { useState } from 'react'
import { useFinalImage } from '@/app/[locale]/(authenticated)/recipe/hooks/useFinalImage'
import { IconAlertCircle } from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'

export function FinalImage({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateFinalImage } = useFinalImage()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpdate = async (imageUrl: string | undefined) => {
    setError('')
    const updates = { finalImage: imageUrl }

    try {
      onChange(updates)

      if (data.id && typeof data.id === 'string') {
        setIsLoading(true)
        await updateFinalImage(data.id, imageUrl)
      }
    } catch (err) {
      setError('Failed to update image')
      onChange({ finalImage: data.finalImage }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateImage = () => {
    if (!data.finalImage) {
      setError('Please upload a final image of your recipe')
      return false
    }
    return true
  }

  return (
    <BaseStep
      title='Final Image'
      description='Add the URL of your finished recipe image.'
      data={data}
      onChange={onChange}
      onNext={() => validateImage() && onNext()}
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
        {data.finalImage ? (
          <div className='relative group'>
            <img
              src={data.finalImage}
              alt='Final recipe'
              className='w-full h-96 object-cover rounded-lg'
            />
            <div
              className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
                          transition-opacity flex items-center justify-center space-x-4'
            >
              <button
                onClick={() => handleImageUpdate(undefined)}
                disabled={isLoading}
                className='px-4 py-2 bg-github-danger-emphasis text-white rounded-md 
                         disabled:opacity-50'
              >
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <input
            type='url'
            placeholder='Enter image URL'
            onChange={(e) => handleImageUpdate(e.target.value)}
            disabled={isLoading}
            className='w-full p-2 border rounded-md'
          />
        )}
      </div>
    </BaseStep>
  )
}

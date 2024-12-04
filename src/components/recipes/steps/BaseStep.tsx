'use client'

import React from 'react'
import { IconChevronLeft, IconChevronRight } from '@/components/ui/icons'

export interface BaseStepProps {
  onNext?: () => void
  onPrevious?: () => void
  isValid?: boolean
  title?: string
  description?: string
  children?: React.ReactNode
}

export function BaseStep({
  onNext,
  onPrevious,
  isValid = true,
  description,
  children,
}: BaseStepProps) {
  return (
    <div className='text-center'>
      {description && <p className='text-sm text-gray-500'>{description}</p>}
      <div className='mt-4'>{children}</div>
      <div className='flex justify-center space-x-4 mt-6'>
        <button
          onClick={onPrevious}
          className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'
        >
          <IconChevronLeft className='h-5 w-5' />
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`${
            isValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'
          } text-white font-semibold py-2 px-4 rounded`}
        >
          <IconChevronRight className='h-5 w-5' />
        </button>
      </div>
    </div>
  )
}

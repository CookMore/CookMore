'use client'

import React from 'react'
import { RecipeData, RecipeMetadata } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export interface BaseStepProps {
  onNext?: () => void
  onPrevious?: () => void
  isValid?: boolean
  title?: string
  description?: string
  children?: React.ReactNode
  onChange?: (updates: Partial<RecipeData>) => void
}

export function BaseStep({
  onNext,
  onPrevious,
  isValid = true,
  title,
  description,
  children,
  onChange,
}: BaseStepProps) {
  return (
    <div className='overflow-x-hidden max-w-4xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md'>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
      {/* You can add logic here to use onChange if needed */}
    </div>
  )
}

'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils/utils'

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  characterLimit?: number
  multiline?: boolean
  required?: boolean
  helperText?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      label,
      error,
      characterLimit,
      multiline,
      required,
      helperText,
      onChange,
      ...props
    },
    ref
  ) => {
    const currentLength = typeof props.value === 'string' ? props.value.length : 0
    const isNearLimit = characterLimit && currentLength > characterLimit * 0.8
    const isAtLimit = characterLimit && currentLength >= characterLimit

    const Component = multiline ? 'textarea' : 'input'

    return (
      <div className='space-y-1'>
        <div className='flex justify-between items-center'>
          <label className='block text-sm font-medium text-github-fg-default'>
            {label}
            {required && <span className='text-github-danger-fg ml-1'>*</span>}
          </label>
          {characterLimit && (
            <span
              className={cn(
                'text-xs',
                isAtLimit
                  ? 'text-github-danger-fg'
                  : isNearLimit
                  ? 'text-github-attention-fg'
                  : 'text-github-fg-muted'
              )}
            >
              {currentLength}/{characterLimit}
            </span>
          )}
        </div>

        <Component
          className={cn(
            'w-full px-3 py-2 rounded-md',
            'bg-github-canvas-subtle',
            'border border-github-border-default',
            'focus:border-github-accent-emphasis focus:ring-1 focus:ring-github-accent-emphasis',
            'transition-colors duration-200',
            error && 'border-github-danger-emphasis',
            className
          )}
          ref={ref as any}
          onChange={onChange}
          {...props}
        />

        {helperText && !error && <p className='mt-1 text-xs text-github-fg-muted'>{helperText}</p>}

        {error && <p className='mt-1 text-xs text-github-danger-fg'>{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

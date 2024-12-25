'use client'

import React from 'react'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  description?: string
  helperText?: string
}

export function FormField({
  label,
  error,
  required,
  children,
  description,
  helperText,
}: FormFieldProps) {
  const id = React.useId()

  return (
    <div className='space-y-1'>
      <label className='block text-sm font-medium text-github-fg-default'>
        {label}
        {required && <span className='text-github-danger-fg ml-1'>*</span>}
        {!required && <span className='ml-1 text-github-fg-muted'>(Optional)</span>}
      </label>
      {description && (
        <p id={`${id}-description`} className='text-xs text-github-fg-muted'>
          {description}
        </p>
      )}
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': description ? `${id}-description` : undefined,
        'aria-invalid': !!error,
        'aria-required': required,
      })}
      {error && (
        <p id={`${id}-error`} className='text-sm text-github-danger-fg mt-1'>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className='text-sm text-github-fg-muted'>
          {helperText}
        </p>
      )}
    </div>
  )
}

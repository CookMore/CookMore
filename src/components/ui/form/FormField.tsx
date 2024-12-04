import React from 'react'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  description?: string
}

export function FormField({ label, error, required, children, description }: FormFieldProps) {
  return (
    <div className='space-y-1'>
      <label className='block text-sm font-medium text-github-fg-default'>
        {label}
        {required && <span className='text-github-danger-fg ml-1'>*</span>}
      </label>
      {description && <p className='text-xs text-github-fg-muted'>{description}</p>}
      {children}
      {error && <p className='text-sm text-github-danger-fg mt-1'>{error}</p>}
    </div>
  )
}

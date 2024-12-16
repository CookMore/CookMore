'use client'

import { forwardRef } from 'react'
import { Control, FieldValues, useController } from 'react-hook-form'
import { cn } from '@/app/api/utils/utils'

interface FormMultiSelectProps<T extends FieldValues> {
  name: string
  label?: string
  options: { value: string; label: string }[]
  control: Control<T>
  error?: string
  required?: boolean
  className?: string
  helperText?: string
}

export const FormMultiSelect = forwardRef<HTMLSelectElement, FormMultiSelectProps<any>>(
  ({ name, label, options, control, error, required, className, helperText, ...props }, ref) => {
    const { field } = useController({ name, control })

    const selectClasses = cn(
      'w-full px-3 py-2 rounded-md',
      'bg-github-canvas-default',
      'border border-github-border-default',
      'text-github-fg-default',
      'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis',
      error && 'border-github-danger-emphasis',
      className
    )

    const labelClasses = cn(
      'block text-sm font-medium mb-1',
      error ? 'text-github-danger-fg' : 'text-github-fg-default'
    )

    return (
      <div className='w-full'>
        {label && (
          <label htmlFor={name} className={labelClasses}>
            {label}
            {required && <span className='text-github-danger-fg ml-1'>*</span>}
          </label>
        )}
        <select
          {...field}
          {...props}
          id={name}
          multiple
          className={selectClasses}
          value={field.value || []}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
            field.onChange(selectedOptions)
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className='mt-1 text-sm text-github-danger-fg'>{error}</p>}
        {helperText && !error && <p className='mt-1 text-sm text-github-fg-muted'>{helperText}</p>}
      </div>
    )
  }
)

'use client'

import { cn } from '@/app/api/utils'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  className?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

interface FormSelectProps extends SelectProps {
  control: Control<any>
  name: string
  theme?: string
}

export function Select({ label, error, className, options, placeholder, ...props }: SelectProps) {
  return (
    <div className='w-full'>
      {label && (
        <label className='mb-2 block text-sm font-medium text-github-fg-default'>{label}</label>
      )}
      <select
        className={cn(
          'block w-full rounded-md border border-github-border-default bg-github-canvas-default px-3 py-2 text-sm text-github-fg-default shadow-sm',
          'focus:border-github-accent-emphasis focus:outline-none focus:ring-1 focus:ring-github-accent-emphasis',
          error && 'border-github-danger-emphasis',
          className
        )}
        {...props}
      >
        {placeholder && <option value=''>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className='mt-1 text-sm text-github-danger-fg'>{error}</p>}
    </div>
  )
}

export function FormSelect({
  control,
  name,
  label,
  error,
  options,
  theme,
  ...props
}: FormSelectProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select {...field} {...props} label={label} error={error} options={options} />
      )}
    />
  )
}

'use client'

import { forwardRef } from 'react'
import { Control, FieldValues, useController } from 'react-hook-form'
import { cn } from '@/lib/utils/utils'

interface FormInputProps<T extends FieldValues> {
  name: string
  label?: string
  placeholder?: string
  multiline?: boolean
  control?: Control<T>
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  className?: string
  helperText?: string
  type?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps<any>>(
  (
    {
      name,
      label,
      placeholder,
      multiline,
      control,
      value: controlledValue,
      onChange: controlledOnChange,
      error,
      required,
      className,
      helperText,
      type = 'text',
      ...props
    },
    ref
  ) => {
    // Handle both controlled and form-controlled inputs
    const controllerProps = control
      ? useController({
          name,
          control,
          defaultValue: '',
        })
      : null

    const inputValue = controllerProps ? controllerProps.field.value : controlledValue ?? ''
    const handleChange = controllerProps ? controllerProps.field.onChange : controlledOnChange

    const inputClasses = cn(
      'w-full px-3 py-2 rounded-md',
      'bg-github-canvas-default',
      'border border-github-border-default',
      'text-github-fg-default placeholder:text-github-fg-subtle',
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
        {multiline ? (
          <textarea
            id={name}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={cn(inputClasses, 'min-h-[100px] resize-y')}
            {...props}
          />
        ) : (
          <input
            id={name}
            type={type}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />
        )}
        {error && <p className='mt-1 text-sm text-github-danger-fg'>{error}</p>}
        {helperText && !error && <p className='mt-1 text-sm text-github-fg-muted'>{helperText}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

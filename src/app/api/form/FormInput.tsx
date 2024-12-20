'use client'

import { forwardRef } from 'react'
import { Control, FieldValues, useController } from 'react-hook-form'
import { cn } from '@/app/api/utils/utils'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'

// Export the FormInputProps interface
export interface FormInputProps<T extends FieldValues> {
  name: string
  label?: string
  placeholder?: string
  multiline?: boolean
  control?: Control<T>
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  required?: boolean
  className?: string
  helperText?: string
  type?: string
  disabled?: boolean
}

export const FormInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps<any>>(
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
      disabled,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // Handle both controlled and form-controlled inputs
    const controllerProps = control
      ? useController({
          name,
          control,
          defaultValue: '',
        })
      : null

    const inputValue = controllerProps ? controllerProps.field.value : (controlledValue ?? '')
    const handleChange = controllerProps ? controllerProps.field.onChange : controlledOnChange

    const inputClasses = cn(
      'w-full px-3 py-2',
      theme === 'neo'
        ? ['neo-input', 'focus:rotate-[0.5deg]']
        : [
            'rounded-md',
            'bg-github-canvas-default',
            'border border-github-border-default',
            'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis focus:border-github-accent-emphasis',
          ],
      'text-github-fg-default placeholder:text-github-fg-subtle',
      'transition-all duration-200 ease-in-out',
      'hover:border-github-border-muted',
      error &&
        'border-github-danger-emphasis focus:ring-github-danger-emphasis focus:border-github-danger-emphasis',
      className
    )

    const labelClasses = cn(
      'block text-sm font-medium mb-1.5',
      'transition-colors duration-200',
      error ? 'text-github-danger-fg' : 'text-github-fg-default'
    )

    return (
      <div className='w-full group'>
        {label && (
          <label htmlFor={name} className={labelClasses}>
            {label}
            {required && <span className='text-github-danger-fg ml-1'>*</span>}
          </label>
        )}
        {multiline ? (
          <textarea
            id={name}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            value={inputValue}
            onChange={handleChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            placeholder={placeholder}
            className={cn(inputClasses, 'min-h-[100px] resize-y')}
            {...props}
          />
        ) : (
          <input
            id={name}
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            value={inputValue}
            onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />
        )}
        {error && (
          <p className='mt-1.5 text-sm text-github-danger-fg flex items-center gap-1.5'>
            <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className='mt-1.5 text-sm text-github-fg-muted flex items-center gap-1.5'>
            <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

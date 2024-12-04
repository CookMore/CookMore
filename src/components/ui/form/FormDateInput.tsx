'use client'

import { forwardRef } from 'react'
import { FormInput, FormInputProps } from './FormInput'

interface FormDateInputProps extends Omit<FormInputProps, 'type'> {
  includeTime?: boolean
}

export const FormDateInput = forwardRef<HTMLInputElement, FormDateInputProps>(
  ({ includeTime = false, ...props }, ref) => {
    return <FormInput ref={ref} type={includeTime ? 'datetime-local' : 'date'} {...props} />
  }
)

FormDateInput.displayName = 'FormDateInput'

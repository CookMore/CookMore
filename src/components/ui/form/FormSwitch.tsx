'use client'

import React from 'react'
import { Switch } from '@headlessui/react'
import { cn } from '@/lib/utils/utils'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'

interface FormSwitchProps {
  name: string
  label: string
  error?: string
  helperText?: string
  defaultChecked?: boolean
  control: Control<any>
}

export function FormSwitch({
  name,
  label,
  error,
  helperText,
  defaultChecked = false,
  control,
}: FormSwitchProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultChecked}
      render={({ field: { value, onChange } }) => (
        <Switch.Group>
          <div className='space-y-1'>
            <div className='flex items-center justify-between gap-4'>
              <Switch.Label className='text-sm font-medium text-github-fg-default'>
                {label}
              </Switch.Label>
              <Switch
                checked={value}
                onChange={onChange}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full',
                  'border border-github-border-default',
                  'transition-colors duration-200 ease-in-out',
                  value ? 'bg-github-success-emphasis' : 'bg-github-canvas-subtle',
                  'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis focus:ring-offset-2'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white',
                    'transition-transform duration-200 ease-in-out',
                    value ? 'translate-x-6' : 'translate-x-1',
                    'shadow-sm'
                  )}
                />
              </Switch>
            </div>
            {helperText && <p className='text-xs text-github-fg-muted pl-0'>{helperText}</p>}
            {error && <p className='text-xs text-github-danger-fg'>{error}</p>}
          </div>
        </Switch.Group>
      )}
    />
  )
}

'use client'

import React from 'react'
import { Switch } from '@headlessui/react'
import { cn } from '@/app/api/utils/utils'
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
          <div className='space-y-2'>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex-1'>
                <Switch.Label className='text-sm font-medium text-github-fg-default'>
                  {label}
                </Switch.Label>
              </div>
              <Switch
                checked={value}
                onChange={onChange}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full',
                  'border border-github-border-default',
                  'transition-all duration-200 ease-in-out',
                  'hover:border-github-border-muted',
                  value
                    ? 'bg-github-success-emphasis border-github-success-emphasis'
                    : 'bg-github-canvas-subtle',
                  'focus:outline-none focus:ring-2',
                  value
                    ? 'focus:ring-github-success-emphasis/30'
                    : 'focus:ring-github-accent-emphasis/30',
                  'cursor-pointer'
                )}
              >
                <span className='sr-only'>Enable {label}</span>
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full',
                    'transition-all duration-200 ease-in-out',
                    'shadow-sm',
                    value ? 'translate-x-6 bg-white' : 'translate-x-1 bg-github-fg-muted/30',
                    value && 'ring-2 ring-white/90'
                  )}
                />
              </Switch>
            </div>
            {(helperText || error) && (
              <div className='flex items-start gap-1.5 pl-0'>
                {error ? (
                  <>
                    <svg
                      className='w-4 h-4 text-github-danger-fg mt-0.5 flex-shrink-0'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <p className='text-sm text-github-danger-fg'>{error}</p>
                  </>
                ) : helperText ? (
                  <>
                    <svg
                      className='w-4 h-4 text-github-fg-muted mt-0.5 flex-shrink-0'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <p className='text-sm text-github-fg-muted'>{helperText}</p>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </Switch.Group>
      )}
    />
  )
}

'use client'

import { ReactNode } from 'react'

export interface FormSectionProps {
  title?: string
  icon?: ReactNode
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, icon, description, children, className }: FormSectionProps) {
  return (
    <section className={`space-y-6 ${className || ''}`}>
      {(title || icon) && (
        <div className='flex items-center gap-3'>
          {icon && <div className='p-2 rounded-md bg-github-canvas-subtle'>{icon}</div>}
          {title && (
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-github-fg-default'>{title}</span>
            </div>
          )}
        </div>
      )}
      {description && (
        <div className='rounded-md bg-github-canvas-subtle p-4 border border-github-border-default'>
          <p className='text-sm text-github-fg-muted'>{description}</p>
        </div>
      )}
      <div className='space-y-4'>{children}</div>
    </section>
  )
}

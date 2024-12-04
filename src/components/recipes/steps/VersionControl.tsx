'use client'

import { useState, useEffect } from 'react'
import { BaseStep } from './BaseStep'
import { RecipeData } from '@/types/recipe'
import { useVersionControl } from '@/hooks/useVersionControl'
import { useChangeLog } from '@/hooks/useChangeLog'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import { StepComponentProps } from './index'

const VERSION_REGEX = /^V\.\d+(\.\d+)?(\.\d+)?$/i
const STATUS_DESCRIPTIONS = {
  stable: 'Production ready, thoroughly tested recipe',
  beta: 'Recipe is being tested and refined',
  alpha: 'Initial draft, still in development',
} as const

export function VersionControl({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { addFork } = useVersionControl()
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const [errors, setErrors] = useState({ version: '', variations: '' })
  const [showStatusInfo, setShowStatusInfo] = useState(false)

  const validateVersion = (version: string) => {
    if (!VERSION_REGEX.test(version)) {
      return 'Version must be in format V.X.X.X (e.g., V.1 or V.1.2)'
    }
    return ''
  }

  const handleVersionChange = async (version: string) => {
    const updatedChangeLog =
      data.changeLog?.map((change) => ({
        ...change,
        version: version,
      })) || []

    const updates = {
      version,
      changeLog: updatedChangeLog,
    }

    onChange(updates)
    await updatePreview('version', updates)
    await logChange(data.id!, 'VERSION_UPDATE', `Version updated to ${version}`)
  }

  const handleVariationsChange = (value: string) => {
    const numValue = parseInt(value)
    if (numValue >= 0) {
      onChange({ variations: numValue })
    }
  }

  useEffect(() => {
    const newErrors = {
      version: validateVersion(data.version || 'V.1'),
      variations: '',
    }
    setErrors(newErrors)
  }, [data.version])

  return (
    <BaseStep
      title='Version Control'
      description='Manage your recipe versions and track variations.'
      data={data}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      isValid={!errors.version && !errors.variations}
    >
      <div className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-2'>Version</label>
            <input
              type='text'
              value={data.version || 'V.1'}
              onChange={(e) => handleVersionChange(e.target.value)}
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                       rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                       focus:ring-github-accent-emphasis'
              placeholder='V.1'
            />
            {errors.version && <p className='mt-1 text-sm text-red-500'>{errors.version}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-2'>
              Status
              <button
                type='button'
                onClick={() => setShowStatusInfo(!showStatusInfo)}
                className='ml-2 text-github-fg-muted hover:text-github-fg-default'
              >
                ⓘ
              </button>
            </label>
            <select
              value={data.status || 'stable'}
              onChange={(e) => onChange({ status: e.target.value as RecipeData['status'] })}
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                       rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                       focus:ring-github-accent-emphasis'
            >
              <option value='stable'>Stable</option>
              <option value='beta'>Beta</option>
              <option value='alpha'>Alpha</option>
            </select>
            {showStatusInfo && (
              <div className='mt-2 p-2 bg-github-canvas-subtle rounded-md text-sm text-github-fg-muted'>
                {STATUS_DESCRIPTIONS[data.status || 'stable']}
              </div>
            )}
          </div>
        </div>

        {data.forkedFrom && (
          <div className='p-4 bg-github-canvas-inset rounded-md'>
            <p className='text-sm text-github-fg-muted'>
              <span className='font-medium'>Forked from:</span> {data.forkedFrom}
            </p>
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-2'>
              Variations
            </label>
            <input
              type='number'
              value={data.variations || 0}
              onChange={(e) => handleVariationsChange(e.target.value)}
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default 
                       rounded-md text-github-fg-default focus:outline-none focus:ring-2 
                       focus:ring-github-accent-emphasis'
              min='0'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-2'>
              Fork Count
              <span className='ml-2 text-xs text-github-fg-muted'>(Auto-tracked)</span>
            </label>
            <input
              type='number'
              value={data.forkCount || 0}
              disabled
              className='w-full px-3 py-2 bg-github-canvas-subtle border border-github-border-default 
                       rounded-md text-github-fg-muted cursor-not-allowed'
            />
          </div>
        </div>
      </div>
    </BaseStep>
  )
}

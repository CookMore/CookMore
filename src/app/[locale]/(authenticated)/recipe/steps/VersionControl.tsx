'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { BaseStep } from './BaseStep'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'
import { StepComponentProps } from './index'

const VERSION_REGEX = /^V\.\d+(\.\d+)?(\.\d+)?$/i
const STATUS_DESCRIPTIONS = {
  stable: 'Production ready, thoroughly tested recipe',
  beta: 'Recipe is being tested and refined',
  alpha: 'Initial draft, still in development',
} as const

// Debounce function
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function VersionControl({
  onNext,
  onBack,
  errors = {},
}: StepComponentProps & { errors: Record<string, string[]> }) {
  const { recipeData, updateRecipe } = useRecipe()
  const [showVersionInfo, setShowVersionInfo] = useState(false)
  const [showStatusInfo, setShowStatusInfo] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateVersion = (version: string) => {
    if (!VERSION_REGEX.test(version)) {
      return 'Version must be in format V.X.X.X (e.g., V.1 or V.1.2)'
    }
    return ''
  }

  const handleVersionChange = useCallback(
    debounce((version: string) => {
      const updatedChangeLog =
        recipeData.changeLog?.map((change: any) => ({
          ...change,
          version: version,
        })) || []

      const updates: Partial<RecipeData> = {
        version,
        changeLog: updatedChangeLog,
      }

      updateRecipe(updates)
    }, 500), // Adjust the delay as needed
    [recipeData.changeLog, updateRecipe]
  )

  const generateVersion = async () => {
    setLoading(true)
    try {
      const title = recipeData.title || 'Untitled'
      const response = await fetch('/api/generate/generateVersion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })
      const data = await response.json()
      if (response.ok) {
        handleVersionChange(data.version) // Use the debounced function
      } else {
        console.error('Error generating version:', data.error)
      }
    } catch (error) {
      console.error('Error generating version:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!recipeData.status) {
      updateRecipe({ status: 'stable' })
    }
  }, [recipeData.status, updateRecipe])

  return (
    <BaseStep
      title='Version Control'
      description='Manage the versioning of your recipe.'
      data={recipeData}
      onChange={updateRecipe}
      onNext={onNext}
      onBack={onBack}
      isValid={!errors.version?.length && !errors.status?.length}
    >
      <div className='space-y-4'>
        <div>
          <label
            htmlFor='version'
            className='block text-sm font-medium text-github-fg-default mb-2'
          >
            Version
            <button
              type='button'
              onClick={() => setShowVersionInfo(!showVersionInfo)}
              className='ml-2 text-github-fg-muted hover:text-github-fg-default'
            >
              ⓘ
            </button>
          </label>
          <input
            id='version'
            type='text'
            value={recipeData.version || ''}
            onChange={(e) => handleVersionChange(e.target.value)}
            className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
            placeholder='Enter version (e.g., V.1.0.0)'
          />
          <button
            type='button'
            onClick={generateVersion}
            className='mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded'
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Version'}
          </button>
          {showVersionInfo && (
            <div className='mt-2 p-2 bg-github-canvas-subtle rounded-md text-sm text-github-fg-muted'>
              Version must be in format V.X.X.X (e.g., V.1 or V.1.2)
            </div>
          )}
          {errors.version && <p className='text-red-500 text-sm'>{errors.version.join(', ')}</p>}
        </div>

        <div>
          <label htmlFor='status' className='block text-sm font-medium text-github-fg-default mb-2'>
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
            id='status'
            value={recipeData.status || 'stable'}
            onChange={(e) => updateRecipe({ status: e.target.value as RecipeData['status'] })}
            className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
          >
            <option value='alpha'>Alpha</option>
            <option value='beta'>Beta</option>
            <option value='stable'>Stable</option>
          </select>
          {showStatusInfo && (
            <div className='mt-2 p-2 bg-github-canvas-subtle rounded-md text-sm text-github-fg-muted'>
              {STATUS_DESCRIPTIONS[recipeData.status || 'stable']}
            </div>
          )}
          {errors.status && <p className='text-red-500 text-sm'>{errors.status.join(', ')}</p>}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-2'>
              Variations
            </label>
            <input
              type='number'
              value={recipeData.variations || 0}
              onChange={(e) => updateRecipe({ variations: parseInt(e.target.value) })}
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
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
              value={recipeData.forkCount || 0}
              disabled
              className='w-full px-3 py-2 bg-github-canvas-subtle border border-github-border-default rounded-md text-github-fg-muted cursor-not-allowed'
            />
          </div>
        </div>
      </div>
    </BaseStep>
  )
}

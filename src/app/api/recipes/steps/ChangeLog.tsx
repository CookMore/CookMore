'use client'

import { useState } from 'react'
import { useChangeLog } from '@/app/api/hooks/useChangeLog'
import { useRecipePreview } from '@/app/api/hooks/useRecipePreview'
import { useAccount } from 'wagmi'
import {
  IconAlertCircle,
  IconLoader,
  IconGitCommit,
  IconGitFork,
  IconGitPullRequest,
} from '@/components/ui/icons'
import { BaseStep } from './BaseStep'
import { RecipeData } from '@/app/api/types/recipe'
import { StepComponentProps } from './index'
import { format } from 'date-fns'

interface ChangeLogEntry {
  id: number
  changes: string[]
  timestamp: string
  parentId: number | null
  version: string
  txHash?: string
}

export function ChangeLog({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { updateChangeLog } = useChangeLog()
  const { updatePreview } = useRecipePreview()
  const { address } = useAccount()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChangeLogUpdate = async (changes: ChangeLogEntry[]) => {
    const updates = { changeLog: changes }
    onChange(updates)

    if (data.id) {
      await updateChangeLog(data.id, updates)
    }
  }

  const addChange = (change: Omit<ChangeLogEntry, 'version'>) => {
    const newVersion = getNextVersion(data.changeLog?.[0]?.version || '0.0.0')
    const newChange: ChangeLogEntry = {
      version: newVersion,
      ...change,
    }

    const updatedLog = [newChange, ...(data.changeLog || [])]
    handleChangeLogUpdate(updatedLog)
  }

  const removeChange = async (index: number) => {
    const updatedLog = (data.changeLog || []).filter((_, i) => i !== index)
    handleChangeLogUpdate(updatedLog)
  }

  const updateChange = async (index: number, updates: Partial<RecipeData['changeLog'][0]>) => {
    setError('')
    const current = [...(data.changeLog || [])]
    current[index] = { ...current[index], ...updates }

    const changeUpdates = { changeLog: current }

    try {
      onChange(changeUpdates)
      await updatePreview('changeLog', changeUpdates)

      if (data.id) {
        setIsLoading(true)
        await updateChangeLog(data.id, changeUpdates)
      }
    } catch (err) {
      setError('Failed to update change')
      onChange({ changeLog: data.changeLog }) // Rollback
    } finally {
      setIsLoading(false)
    }
  }

  const validateChangeLog = () => {
    if (!data.changeLog?.length) {
      setError('At least one change entry is required')
      return false
    }

    const invalidEntries = data.changeLog.filter((entry) => !entry.message?.trim())

    if (invalidEntries.length > 0) {
      setError('All changes must include a description')
      return false
    }

    return true
  }

  const getIcon = (type: RecipeData['changeLog'][0]['type']) => {
    switch (type) {
      case 'create':
        return IconGitCommit
      case 'fork':
        return IconGitFork
      case 'update':
      case 'mint':
        return IconGitPullRequest
      default:
        return IconGitCommit
    }
  }

  return (
    <BaseStep
      title='Change Log'
      description='Track changes and updates to your recipe.'
      data={data}
      onChange={onChange}
      onNext={() => validateChangeLog() && onNext()}
      onBack={onBack}
      isValid={!error && !isLoading}
      isSaving={isLoading}
    >
      {error && (
        <div className='mb-4 p-3 bg-github-danger-subtle rounded-md flex items-center text-github-danger-fg'>
          <IconAlertCircle className='w-4 h-4 mr-2' />
          {error}
        </div>
      )}

      <div className='space-y-6'>
        <div className='flex justify-end space-x-4'>
          <button
            onClick={() => addChange('update')}
            disabled={isLoading}
            className='flex items-center space-x-2 px-4 py-2 bg-github-success-emphasis 
                     text-white rounded-md disabled:opacity-50'
          >
            {isLoading ? (
              <IconLoader className='w-4 h-4 animate-spin' />
            ) : (
              <IconGitPullRequest className='w-4 h-4' />
            )}
            <span>Add Change</span>
          </button>
        </div>

        <div className='space-y-4'>
          {data.changeLog?.map((change, index) => {
            const Icon = getIcon(change.type)

            return (
              <div key={index} className='p-4 bg-github-canvas-subtle rounded-md space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <Icon className='w-5 h-5 text-github-fg-muted' />
                    <span className='text-sm font-medium text-github-fg-default'>
                      {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                    </span>
                    <span className='text-sm text-github-fg-muted'>
                      {format(new Date(change.date), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <span className='text-sm font-mono text-github-fg-muted'>{change.version}</span>
                </div>

                <textarea
                  value={change.message}
                  onChange={(e) => updateChange(index, { message: e.target.value })}
                  className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
                  placeholder='Describe your changes...'
                  rows={2}
                />

                {change.txHash && (
                  <div className='flex items-center space-x-2'>
                    <span className='text-xs text-github-fg-muted'>Transaction:</span>
                    <a
                      href={change?.txHash ? `https://etherscan.io/tx/${change.txHash}` : '#'}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs font-mono text-github-accent-fg hover:underline'
                    >
                      {change.txHash.slice(0, 8)}...{change.txHash.slice(-6)}
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </BaseStep>
  )
}

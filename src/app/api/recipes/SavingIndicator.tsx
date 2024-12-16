'use client'

import { useRecipe } from '@/app/api/providers/RecipeProvider'
import { IconCheck, IconLoader, IconAlertCircle } from '@/components/ui/icons'
import { format } from 'date-fns'

export function SavingIndicator() {
  const { savingStatus, lastSaved } = useRecipe()

  return (
    <div className='flex items-center space-x-2 text-sm'>
      {savingStatus === 'saving' && (
        <>
          <IconLoader className='w-4 h-4 animate-spin text-github-fg-muted' />
          <span className='text-github-fg-muted'>Saving...</span>
        </>
      )}

      {savingStatus === 'saved' && (
        <>
          <IconCheck className='w-4 h-4 text-github-success-fg' />
          <span className='text-github-fg-muted'>
            Saved {lastSaved && format(lastSaved, 'h:mm a')}
          </span>
        </>
      )}

      {savingStatus === 'error' && (
        <>
          <IconAlertCircle className='w-4 h-4 text-github-danger-fg' />
          <span className='text-github-danger-fg'>Error saving</span>
        </>
      )}
    </div>
  )
}

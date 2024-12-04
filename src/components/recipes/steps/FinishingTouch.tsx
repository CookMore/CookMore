'use client'

import { BaseStep } from './BaseStep'
import { RecipeData } from '@/types/recipe'
import { IconPlus, IconX } from '@/components/ui/icons'
import { StepComponentProps } from './index'

export function FinishingTouch({ data, onChange, onNext, onBack }: StepComponentProps) {
  const addNote = (note: string) => {
    if (!note.trim()) return
    onChange({
      finishingNotes: [...(data.finishingNotes || []), note.trim()],
    })
  }

  const removeNote = (index: number) => {
    onChange({
      finishingNotes: data.finishingNotes?.filter((_, i) => i !== index),
    })
  }

  return (
    <BaseStep
      title='Finishing Touch'
      description='Add final notes and tips for perfecting the recipe.'
      data={data}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
    >
      <div className='space-y-6'>
        <div className='space-y-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Add a finishing note (press Enter)'
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addNote(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
            />
            <IconPlus className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-github-fg-muted' />
          </div>

          <div className='space-y-2'>
            {data.finishingNotes?.map((note, index) => (
              <div
                key={index}
                className='flex items-start space-x-2 p-4 bg-github-canvas-subtle rounded-md'
              >
                <p className='flex-1 text-github-fg-default'>{note}</p>
                <button
                  onClick={() => removeNote(index)}
                  className='text-github-fg-muted hover:text-github-danger-fg'
                >
                  <IconX className='w-5 h-5' />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseStep>
  )
}

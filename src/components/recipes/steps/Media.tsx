'use client'

import { UploadButton } from '@/utils/uploadthing'
import { useState } from 'react'
import { IconTrashCan } from '@/components/ui/icons'
import { StepComponentProps } from './index'
import { RecipeData } from '@/types/recipe'

export function Media({ data, onChange, onNext, onBack }: StepComponentProps) {
  const [isUploading, setIsUploading] = useState(false)

  return (
    <div className='space-y-6'>
      {/* Cover Image */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-github-fg-default'>Cover Image</h3>
        <div className='border-2 border-dashed border-github-border-default rounded-lg p-6'>
          {data.coverImage ? (
            <div className='relative group'>
              <img
                src={data.coverImage}
                alt='Recipe cover'
                className='w-full h-48 object-cover rounded-md'
              />
              <button
                onClick={() => onChange({ coverImage: undefined })}
                className='absolute top-2 right-2 p-2 bg-github-danger-emphasis text-white rounded-md 
                         opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2'
              >
                <IconTrashCan className='w-4 h-4' />
                <span>Remove</span>
              </button>
            </div>
          ) : (
            <div className='space-y-4'>
              <UploadButton
                endpoint='imageUploader'
                onUploadBegin={() => setIsUploading(true)}
                onClientUploadComplete={(res) => {
                  setIsUploading(false)
                  if (res?.[0]?.url) {
                    onChange({ coverImage: res[0].url })
                  }
                }}
                onUploadError={(err: Error) => {
                  setIsUploading(false)
                  console.error(err)
                }}
                appearance={{
                  button:
                    'px-4 py-2 bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90 w-full',
                  allowedContent: 'text-sm text-github-fg-muted mt-2',
                }}
              />
              {isUploading && (
                <div className='text-sm text-github-fg-muted text-center'>Uploading image...</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video URL */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-github-fg-default'>Video URL (Optional)</h3>
        <input
          type='url'
          value={data.videoUrl || ''}
          onChange={(e) => onChange({ videoUrl: e.target.value })}
          placeholder='e.g., YouTube or Vimeo URL'
          className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
        />
      </div>

      {/* Navigation */}
      <div className='flex justify-between'>
        <button
          onClick={onBack}
          className='px-4 py-2 text-github-fg-default bg-github-canvas-subtle rounded-md hover:bg-github-canvas-default'
        >
          Back
        </button>
        <button
          onClick={onNext}
          className='px-4 py-2 bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90'
        >
          Next: Tags
        </button>
      </div>
    </div>
  )
}

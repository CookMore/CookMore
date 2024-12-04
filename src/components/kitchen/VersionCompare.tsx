'use client'

import React from 'react'

interface VersionCompareProps {
  recipeId: string
  versions: string[]
  onClose: () => void
}

export function VersionCompare({ recipeId, versions, onClose }: VersionCompareProps) {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-github-fg-default'>Compare Versions</h2>
        <button onClick={onClose} className='text-github-fg-muted hover:text-github-fg-default'>
          Close
        </button>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='border border-github-border-default rounded-lg p-4'>
          <h3 className='font-medium text-github-fg-default mb-2'>Version {versions[0]}</h3>
          {/* Version content */}
        </div>
        <div className='border border-github-border-default rounded-lg p-4'>
          <h3 className='font-medium text-github-fg-default mb-2'>Version {versions[1]}</h3>
          {/* Version content */}
        </div>
      </div>
    </div>
  )
}

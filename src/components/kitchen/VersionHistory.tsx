'use client'

import React from 'react'

interface VersionHistoryProps {
  recipeId: string
  onVersionSelect: (version: string) => void
}

export function VersionHistory({ recipeId, onVersionSelect }: VersionHistoryProps) {
  return (
    <div className='space-y-4'>
      {/* Placeholder for version list */}
      <div className='border border-github-border-default rounded-lg divide-y'>
        <div
          className='p-4 hover:bg-github-canvas-subtle cursor-pointer'
          onClick={() => onVersionSelect('v1')}
        >
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='font-medium text-github-fg-default'>Version 1.0</h3>
              <p className='text-sm text-github-fg-muted'>Initial recipe</p>
            </div>
            <span className='text-sm text-github-fg-muted'>2 days ago</span>
          </div>
        </div>
        {/* Add more versions here */}
      </div>
    </div>
  )
}

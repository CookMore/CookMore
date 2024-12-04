'use client'

import React from 'react'

export function IssueList() {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold text-github-fg-default'>Issues</h2>
        <button className='px-3 py-1.5 text-sm bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90'>
          New Issue
        </button>
      </div>

      <div className='bg-github-canvas-subtle rounded-lg p-4'>
        <p className='text-github-fg-muted'>No issues found.</p>
      </div>
    </div>
  )
}

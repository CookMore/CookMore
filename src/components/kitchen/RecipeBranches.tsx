'use client'

import { useState } from 'react'
import { Recipe, Branch, RecipeBranchesProps } from '@/types/recipe'
import { IconGitBranch, IconCheck, IconTrash, IconGitCommit } from '@/components/ui/icons'
import { formatDistanceToNow } from 'date-fns'

export function RecipeBranches({ recipe, branches }: RecipeBranchesProps) {
  const [newBranchName, setNewBranchName] = useState('')
  const [showNewBranchModal, setShowNewBranchModal] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const defaultBranch = branches.find((b) => b.isDefault)

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Branch Header */}
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center space-x-2'>
          <IconGitBranch className='w-5 h-5 text-github-fg-muted' />
          <h2 className='text-xl font-semibold text-github-fg-default'>
            {branches.length} {branches.length === 1 ? 'branch' : 'branches'}
          </h2>
        </div>
        <button
          onClick={() => setShowNewBranchModal(true)}
          className='px-3 py-1.5 text-sm bg-github-btn-bg border border-github-btn-border rounded-md hover:bg-github-btn-hover'
        >
          New branch
        </button>
      </div>

      {/* Default Branch Section */}
      {defaultBranch && (
        <div className='mb-8'>
          <div className='text-sm font-medium text-github-fg-default mb-2'>Default branch</div>
          <div className='bg-github-canvas-subtle border border-github-border-default rounded-md p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <IconGitBranch className='w-4 h-4 text-github-fg-muted' />
                <span className='font-medium text-github-fg-default'>{defaultBranch.name}</span>
                <span className='text-xs bg-github-accent-emphasis text-white px-2 py-0.5 rounded-full'>
                  Default
                </span>
              </div>
              <button className='text-sm text-github-fg-muted hover:text-github-fg-default'>
                Change default branch
              </button>
            </div>
            <div className='mt-2 text-sm text-github-fg-muted'>
              Last commit {formatDistanceToNow(defaultBranch.lastCommit.date, { addSuffix: true })}
            </div>
          </div>
        </div>
      )}

      {/* Branch List */}
      <div className='border border-github-border-default rounded-md divide-y divide-github-border-default'>
        {branches.map((branch) => (
          <div key={branch.name} className='p-4 hover:bg-github-canvas-subtle transition-colors'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <IconGitBranch className='w-4 h-4 text-github-fg-muted' />
                <span className='font-medium text-github-fg-default'>{branch.name}</span>
                {branch.isDefault && (
                  <span className='text-xs bg-github-accent-emphasis text-white px-2 py-0.5 rounded-full'>
                    Default
                  </span>
                )}
              </div>
              <div className='flex items-center space-x-4'>
                <div className='text-sm text-github-fg-muted'>
                  Updated {formatDistanceToNow(branch.lastCommit.date, { addSuffix: true })}
                </div>
                <button className='text-github-fg-muted hover:text-github-danger-fg'>
                  <IconTrash className='w-4 h-4' />
                </button>
              </div>
            </div>
            <div className='mt-2 flex items-center space-x-4 text-sm text-github-fg-muted'>
              <div className='flex items-center'>
                <IconGitCommit className='w-4 h-4 mr-1' />
                {branch.lastCommit.sha.slice(0, 7)}
              </div>
              <div>
                {branch.ahead > 0 && (
                  <span className='text-github-success-fg'>{branch.ahead} ahead</span>
                )}
                {branch.behind > 0 && (
                  <span className='text-github-danger-fg'> {branch.behind} behind</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Branch Modal */}
      {showNewBranchModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-github-canvas-default rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold text-github-fg-default mb-4'>
              Create a new branch
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-1'>
                  Branch name
                </label>
                <input
                  type='text'
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className='w-full px-3 py-2 border border-github-border-default rounded-md bg-github-canvas-subtle text-github-fg-default'
                  placeholder='feature/new-variation'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-github-fg-default mb-1'>
                  Create from
                </label>
                <select className='w-full px-3 py-2 border border-github-border-default rounded-md bg-github-canvas-subtle text-github-fg-default'>
                  {branches.map((branch) => (
                    <option key={branch.name} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex justify-end space-x-2'>
                <button
                  onClick={() => setShowNewBranchModal(false)}
                  className='px-3 py-1.5 text-sm border border-github-border-default rounded-md hover:bg-github-canvas-subtle'
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle branch creation
                    setShowNewBranchModal(false)
                  }}
                  className='px-3 py-1.5 text-sm bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90'
                >
                  Create branch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

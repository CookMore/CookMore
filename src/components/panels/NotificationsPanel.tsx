'use client'

import { BasePanel } from './BasePanel'

export function NotificationsPanel() {
  return (
    <BasePanel title='Notifications'>
      <div className='space-y-4'>
        {/* Placeholder notifications */}
        <div className='space-y-2'>
          {/* We'll replace these with real notifications later */}
          <div className='p-3 rounded-md bg-github-canvas-default hover:bg-github-canvas-subtle cursor-pointer'>
            <div className='text-sm font-medium text-github-fg-default'>New Recipe Comment</div>
            <div className='text-xs text-github-fg-muted mt-1'>
              Someone commented on your Pasta Recipe
            </div>
            <div className='text-xs text-github-fg-muted mt-1'>2 hours ago</div>
          </div>

          <div className='p-3 rounded-md bg-github-canvas-default hover:bg-github-canvas-subtle cursor-pointer'>
            <div className='text-sm font-medium text-github-fg-default'>Recipe Featured</div>
            <div className='text-xs text-github-fg-muted mt-1'>
              Your Pizza Recipe was featured today!
            </div>
            <div className='text-xs text-github-fg-muted mt-1'>1 day ago</div>
          </div>
        </div>

        {/* View all link */}
        <button className='w-full text-center px-4 py-2 text-sm text-github-accent-fg hover:text-github-accent-emphasis'>
          View All Notifications
        </button>
      </div>
    </BasePanel>
  )
}

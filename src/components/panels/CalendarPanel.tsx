'use client'

import { BasePanel } from './BasePanel'
import { IconCalendar } from '@/components/ui/icons'
import Link from 'next/link'

export function CalendarPanel() {
  return (
    <BasePanel title='Calendar'>
      <div className='space-y-4'>
        {/* Mini Calendar View */}
        <div className='bg-github-canvas-default rounded-md p-3'>
          {/* We'll add a simplified calendar view here */}
          <div className='text-sm text-github-fg-muted mb-2'>Upcoming Culinary Events</div>
          <div className='space-y-2'>
            {/* Example events */}
            <div className='flex items-center space-x-2 text-sm'>
              <IconCalendar className='w-4 h-4 text-github-fg-muted' />
              <span>National Pizza Day - Feb 9</span>
            </div>
            <div className='flex items-center space-x-2 text-sm'>
              <IconCalendar className='w-4 h-4 text-github-fg-muted' />
              <span>Food Festival - Mar 15</span>
            </div>
          </div>
        </div>

        {/* Link to full calendar */}
        <Link
          href='/calendar'
          className='block text-center px-4 py-2 bg-github-accent-emphasis text-white rounded-md hover:bg-github-accent-emphasis/90'
        >
          View Full Calendar
        </Link>
      </div>
    </BasePanel>
  )
}

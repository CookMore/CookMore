'use client'

import { BasePanel } from './BasePanel'
import { IconCalendar, IconBook, IconStar } from '@/components/ui/icons'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CalendarPanel() {
  return (
    <BasePanel title='Food Calendar'>
      <div className='space-y-4'>
        {/* Today's Menu */}
        <div className='bg-github-canvas-default rounded-md p-4 border border-github-border-default'>
          <h3 className='text-sm font-medium text-github-fg-default mb-3 flex items-center gap-2'>
            <IconStar className='w-4 h-4 text-github-accent-fg' />
            Today's Menu
          </h3>
          <div className='space-y-3'>
            <div className='flex items-start gap-3'>
              <div className='w-16 text-xs text-github-fg-muted'>Breakfast</div>
              <div className='flex-1'>
                <div className='text-sm text-github-fg-default'>Avocado Toast</div>
                <div className='text-xs text-github-fg-muted mt-0.5'>With poached eggs</div>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-16 text-xs text-github-fg-muted'>Lunch</div>
              <div className='flex-1'>
                <div className='text-sm text-github-fg-default'>Quinoa Bowl</div>
                <div className='text-xs text-github-fg-muted mt-0.5'>With roasted vegetables</div>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-16 text-xs text-github-fg-muted'>Dinner</div>
              <div className='flex-1'>
                <div className='text-sm text-github-fg-default'>Grilled Salmon</div>
                <div className='text-xs text-github-fg-muted mt-0.5'>With asparagus</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className='bg-github-canvas-default rounded-md p-4 border border-github-border-default'>
          <h3 className='text-sm font-medium text-github-fg-default mb-3 flex items-center gap-2'>
            <IconBook className='w-4 h-4 text-github-accent-fg' />
            AI Suggestions
          </h3>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-github-success-emphasis' />
              <span>Try Mediterranean cuisine this week</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-github-success-emphasis' />
              <span>Seasonal ingredients: Asparagus, Peas</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 rounded-full bg-github-success-emphasis' />
              <span>Meal prep suggestion: Sunday 2PM</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='space-y-2'>
          <Link href='/calendar'>
            <Button variant='default' className='w-full flex items-center justify-center gap-2'>
              <IconCalendar className='w-4 h-4' />
              Open Full Calendar
            </Button>
          </Link>
          <Button
            variant='outline'
            className='w-full flex items-center justify-center gap-2'
            onClick={() => {
              // TODO: Implement AI meal planning
              console.log('Generate meal plan')
            }}
          >
            <IconBook className='w-4 h-4' />
            Generate New Plan
          </Button>
        </div>
      </div>
    </BasePanel>
  )
}

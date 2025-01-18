'use client'

import { useState } from 'react'
import { IconChevronLeft, IconUtensils, IconList, IconCalendar } from '@/app/api/icons'
import { cn } from '@/app/api/utils/utils'

interface CalendarSidebarProps {
  setActiveView: React.Dispatch<React.SetStateAction<string>>
}

export function CalendarSidebar({ setActiveView }: CalendarSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div
      className={cn(
        'fixed left-0 top-16 bottom-0',
        'flex flex-col border-r border-github-border-default',
        'bg-github-canvas-default',
        'transition-all duration-300 ease-in-out',
        'z-[40]',
        isExpanded ? 'w-[280px]' : 'w-[48px]'
      )}
    >
      <div className='flex items-center justify-between border-b border-github-border-default py-5 px-4'>
        <h2
          className={cn(
            'text-base font-bold text-github-fg-default transition-opacity text-center flex-1 mt-1',
            !isExpanded && 'opacity-0'
          )}
        >
          Meal Planner
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex items-center justify-center',
            'w-8 h-8 rounded-full',
            'bg-github-canvas-default',
            'border-2 border-github-border-default',
            'hover:bg-github-canvas-subtle transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-github-accent-emphasis focus:ring-offset-2',
            'shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
            'absolute right-0 translate-x-1/2',
            'z-[101]',
            'cursor-pointer'
          )}
          aria-label={isExpanded ? 'Retract sidebar' : 'Expand sidebar'}
        >
          <IconChevronLeft
            className={cn(
              'h-5 w-5 text-github-fg-default',
              'transition-transform duration-200',
              !isExpanded && 'rotate-180'
            )}
          />
        </button>
      </div>
      <div className='flex-1 space-y-2 p-2 overflow-y-auto'>
        <button
          onClick={() => setActiveView('MealPlanner')}
          className='flex items-center w-full p-3 text-left transition-all duration-200 border rounded-lg space-x-3 bg-github-canvas-default border-github-border-default hover:bg-github-canvas-subtle'
        >
          <IconUtensils className='h-5 w-5 text-github-fg-default' />
          {isExpanded && <span>Meal Plans</span>}
        </button>
        <button
          onClick={() => setActiveView('MealShoppingList')}
          className='flex items-center w-full p-3 text-left transition-all duration-200 border rounded-lg space-x-3 bg-github-canvas-default border-github-border-default hover:bg-github-canvas-subtle'
        >
          <IconList className='h-5 w-5 text-github-fg-default' />
          {isExpanded && <span>Shopping List</span>}
        </button>
        <button
          onClick={() => setActiveView('CalendarView')}
          className='flex items-center w-full p-3 text-left transition-all duration-200 border rounded-lg space-x-3 bg-github-canvas-default border-github-border-default hover:bg-github-canvas-subtle'
        >
          <IconCalendar className='h-5 w-5 text-github-fg-default' />
          {isExpanded && <span>Calendar View</span>}
        </button>
      </div>
    </div>
  )
}

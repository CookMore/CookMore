'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/app/api/utils/utils'
import { IconChevronLeft } from '@/app/api/icons'

interface DashboardSidebarProps {
  setActiveWidgets: (widgets: string[]) => void
}

const widgetOptions = [
  { id: 'feed', name: 'Feed Widget' },
  { id: 'recipe', name: 'Recipe Widget' },
  { id: 'timer', name: 'Timer Widget' },
  { id: 'conversion', name: 'Conversion Widget' },
]

export default function DashboardSidebar({ setActiveWidgets }: DashboardSidebarProps) {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(
    widgetOptions.map((widget) => widget.id)
  )
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    setActiveWidgets(selectedWidgets)
  }, [selectedWidgets, setActiveWidgets])

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets((prevSelected) =>
      prevSelected.includes(widgetId)
        ? prevSelected.filter((id) => id !== widgetId)
        : [...prevSelected, widgetId]
    )
  }

  return (
    <div
      className={cn(
        'fixed left-0 top-16 bottom-0',
        'flex flex-col border-r border-github-border-default',
        'bg-github-canvas-subtle',
        'transition-all duration-300 ease-in-out',
        'z-40',
        isExpanded ? 'w-[280px]' : 'w-[48px]'
      )}
    >
      <div className='flex items-center justify-between border-b border-github-border-default py-5 px-4'>
        <h2
          className={cn(
            'text-lg font-bold transition-opacity text-center flex-1 mt-1',
            !isExpanded && 'opacity-0'
          )}
        >
          Select Widgets
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
        <ul className='space-y-2'>
          {widgetOptions.map((widget) => (
            <li key={widget.id}>
              <label className='flex items-center p-2 bg-github-canvas-default border border-github-border-default rounded-md shadow-sm hover:shadow-md transition-shadow duration-200'>
                <input
                  type='checkbox'
                  checked={selectedWidgets.includes(widget.id)}
                  onChange={() => toggleWidget(widget.id)}
                  className='mr-2 accent-github-accent-emphasis'
                />
                {isExpanded && <span className='text-github-fg-default'>{widget.name}</span>}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

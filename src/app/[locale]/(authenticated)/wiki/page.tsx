'use client'

import { useState, useEffect } from 'react'
import { WikiSidebar } from './WikiSidebar'
import { cn } from '@/app/api/utils/utils'

export default function WikiPage() {
  const [mounted, setMounted] = useState(false)
  const [activeView, setActiveView] = useState('Tab1') // Default to the first tab

  useEffect(() => {
    console.log('WikiPage mounting...')
    setMounted(true)
    console.log('WikiPage mounted')
    return () => {
      console.log('WikiPage unmounting')
    }
  }, [])

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className='min-h-screen bg-github-canvas-default'>
        <div className='animate-pulse fixed left-0 top-16 bottom-0 w-[280px] bg-github-canvas-subtle z-40' />
        <div className={cn('animate-pulse', 'ml-[280px]', 'p-8', 'relative', 'z-30')}>
          <div className='h-8 bg-github-canvas-subtle rounded w-1/4 mb-6'></div>
          <div className='space-y-4'>
            <div className='h-32 bg-github-canvas-subtle rounded'></div>
            <div className='h-32 bg-github-canvas-subtle rounded'></div>
          </div>
        </div>
      </div>
    )
  }

  const renderActiveView = () => {
    console.log('Rendering active view:', activeView)
    switch (activeView) {
      case 'Tab1':
        return <div>Content for Tab 1</div>
      case 'Tab2':
        return <div>Content for Tab 2</div>
      case 'Tab3':
        return <div>Content for Tab 3</div>
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <WikiSidebar setActiveView={setActiveView} />
      <main
        className={cn(
          'transition-all duration-300 ease-in-out',
          'ml-[280px]', // Match sidebar width
          'p-8',
          'relative',
          'z-30' // Below sidebar z-index
        )}
      >
        {renderActiveView()}
      </main>
    </div>
  )
}

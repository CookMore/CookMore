'use client'

import { useState, useEffect } from 'react'
import { CalendarSidebar } from './CalendarSidebar'
import MealPlanner from './MealPlanner'
import MealCalendar from './MealCalendar'
import MealShoppingList from './MealShoppingList'
import { cn } from '@/app/api/utils/utils'
import { useAuth } from '@/app/api/auth/hooks/useAuth'

export default function CalendarPage() {
  const [mounted, setMounted] = useState(false)
  const [activeView, setActiveView] = useState('MealPlanner')
  const [mealPlans, setMealPlans] = useState<string[]>([])
  const { user, tier } = useAuth()

  useEffect(() => {
    console.log('CalendarPage mounting...', { tier, user })
    setMounted(true)
    console.log('CalendarPage mounted')
    return () => {
      console.log('CalendarPage unmounting')
    }
  }, [tier, user])

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
    console.log('Rendering active view:', activeView, { tier })
    switch (activeView) {
      case 'MealPlanner':
        return <MealPlanner setMealPlans={setMealPlans} tier={tier} />
      case 'MealShoppingList':
        return <MealShoppingList tier={tier} />
      case 'CalendarView':
        return <MealCalendar mealPlans={mealPlans} tier={tier} />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <CalendarSidebar setActiveView={setActiveView} tier={tier} />
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

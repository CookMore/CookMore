'use client'

import { useState } from 'react'
import { SingleSidebarLayout } from '@/components/layouts/SingleSidebarLayout'
import { IconCalendar, IconBook, IconStar } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <SingleSidebarLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <IconCalendar className='w-6 h-6 text-github-accent-fg' />
            <h1 className='text-2xl font-semibold text-github-fg-default'>AI Food Calendar</h1>
          </div>
          <Button
            className='flex items-center gap-2'
            onClick={() => {
              // TODO: Implement AI meal planning
              console.log('Generate AI meal plan')
            }}
          >
            <IconBook className='w-4 h-4' />
            Generate Meal Plan
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className='grid grid-cols-7 gap-4'>
          {/* TODO: Implement calendar grid with meal planning */}
          {/* This will include:
              - Calendar view with meal slots
              - AI-suggested recipes
              - Nutritional planning
              - Shopping list generation
              - Recipe integration
              - Seasonal ingredients
          */}
        </div>

        {/* Features Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='p-6 rounded-lg border border-github-border-default bg-github-canvas-subtle'>
            <IconStar className='w-8 h-8 text-github-accent-fg mb-4' />
            <h3 className='text-lg font-medium mb-2'>AI Recipe Suggestions</h3>
            <p className='text-github-fg-muted'>
              Get personalized recipe suggestions based on your preferences and seasonal
              ingredients.
            </p>
          </div>

          {/* Add more feature cards */}
        </div>
      </div>
    </SingleSidebarLayout>
  )
}

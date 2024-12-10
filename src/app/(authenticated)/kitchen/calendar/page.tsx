'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PanelContainer } from '@/components/panels/PanelContainer'
import { PageContainer } from '@/components/layouts/PageContainer'

export default function CalendarPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHolidays, setSelectedHolidays] = useState<string[]>([])

  const holidayTypes = [
    'Food Holidays',
    'Cultural Celebrations',
    'Cooking Events',
    'Food Festivals',
  ]

  return (
    <div className='flex flex-col min-h-screen'>
      <PageHeader title='Culinary Calendar' />
      <main className='flex-1 p-6'>
        <PanelContainer>
          <PageContainer>
            {/* Search and Filters */}
            <div className='mb-6 space-y-4'>
              {/* Search */}
              <div className='relative'>
                <input
                  type='search'
                  placeholder='Search events...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full px-4 py-2 rounded-md border border-github-border-default bg-github-canvas-subtle'
                />
              </div>

              {/* Holiday Type Toggles */}
              <div className='flex flex-wrap gap-2'>
                {holidayTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedHolidays((prev) =>
                        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                      )
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedHolidays.includes(type)
                        ? 'bg-github-accent-emphasis text-white'
                        : 'bg-github-canvas-subtle text-github-fg-default'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className='bg-github-canvas-default rounded-lg border border-github-border-default p-6'>
              {/* Calendar header */}
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>February 2024</h2>
                <div className='space-x-2'>
                  <button className='px-3 py-1 rounded-md bg-github-canvas-subtle'>Previous</button>
                  <button className='px-3 py-1 rounded-md bg-github-canvas-subtle'>Next</button>
                </div>
              </div>

              {/* Calendar grid */}
              <div className='grid grid-cols-7 gap-2'>
                {/* Days of week */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className='text-center text-sm font-medium py-2'>
                    {day}
                  </div>
                ))}
                {/* Calendar days would go here */}
              </div>
            </div>
          </PageContainer>
        </PanelContainer>
      </main>
    </div>
  )
}

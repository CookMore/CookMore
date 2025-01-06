import React from 'react'
import GridLayout from 'react-grid-layout'
import FeedWidget from '@/app/api/components/widgets/FeedWidget'
import RecipeWidget from '@/app/api/components/widgets/RecipeWidget'
import TimerWidget from '@/app/api/components/widgets/TimerWidget'
import ConversionWidget from '@/app/api/components/widgets/ConversionWidget'

export default function AuthenticatedPage() {
  const layout = [
    { i: 'feed', x: 0, y: 0, w: 2, h: 2 },
    { i: 'recipe', x: 2, y: 0, w: 2, h: 2 },
    { i: 'timer', x: 4, y: 0, w: 2, h: 2 },
    { i: 'conversion', x: 6, y: 0, w: 2, h: 2 },
  ]

  return (
    <div className='container mx-auto px-4'>
      <GridLayout className='layout' layout={layout} cols={12} rowHeight={30} width={1200}>
        <div key='feed'>
          <FeedWidget />
        </div>
        <div key='recipe'>
          <RecipeWidget />
        </div>
        <div key='timer'>
          <TimerWidget />
        </div>
        <div key='conversion'>
          <ConversionWidget />
        </div>
      </GridLayout>
    </div>
  )
}

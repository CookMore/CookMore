'use client'

import React, { useState, useEffect } from 'react'
import GridLayout, { Layout } from 'react-grid-layout'
import FeedWidget from '@/app/api/components/widgets/FeedWidget'
import RecipeWidget from '@/app/api/components/widgets/RecipeWidget'
import TimerWidget from '@/app/api/components/widgets/TimerWidget'
import ConversionWidget from '@/app/api/components/widgets/ConversionWidget'
import DashboardSidebar from './DashboardSidebar'
import { DualSidebarLayout } from '@/app/api/layouts/DualSidebarLayout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

interface CustomLayout extends Layout {
  minW: number
  minH: number
}

export default function AuthenticatedPage() {
  const [activeWidgets, setActiveWidgets] = useState<string[]>([
    'feed',
    'recipe',
    'timer',
    'conversion',
  ])

  const [layout, setLayout] = useState<CustomLayout[]>([
    { i: 'feed', x: 0, y: 0, w: 4, h: 3, minW: 4, minH: 3 },
    { i: 'recipe', x: 4, y: 0, w: 4, h: 3, minW: 4, minH: 3 },
    { i: 'timer', x: 8, y: 0, w: 4, h: 3, minW: 4, minH: 3 },
    { i: 'conversion', x: 0, y: 3, w: 4, h: 3, minW: 4, minH: 3 },
  ])

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout as CustomLayout[])
    const newOrder = newLayout.map((item) => item.i)
    setActiveWidgets(newOrder)
  }

  const renderWidgets = () => {
    return activeWidgets.map((widget) => {
      switch (widget) {
        case 'feed':
          return (
            <div
              key='feed'
              className='widget border border-github-border-default shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer'
            >
              <FeedWidget />
            </div>
          )
        case 'recipe':
          return (
            <div
              key='recipe'
              className='widget border border-github-border-default shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer'
            >
              <RecipeWidget />
            </div>
          )
        case 'timer':
          return (
            <div
              key='timer'
              className='widget border border-github-border-default shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer'
            >
              <TimerWidget />
            </div>
          )
        case 'conversion':
          return (
            <div
              key='conversion'
              className='widget border border-github-border-default shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer'
            >
              <ConversionWidget />
            </div>
          )
        default:
          return null
      }
    })
  }

  return (
    <DualSidebarLayout isLeftSidebarExpanded={true}>
      <DashboardSidebar setActiveWidgets={setActiveWidgets} />
      <div className='container'>
        <GridLayout
          className='layout'
          layout={layout}
          onLayoutChange={onLayoutChange}
          cols={1}
          rowHeight={80}
          width={window.innerWidth - 32}
        >
          {renderWidgets()}
        </GridLayout>
      </div>
    </DualSidebarLayout>
  )
}

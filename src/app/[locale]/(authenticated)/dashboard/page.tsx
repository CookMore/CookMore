'use client'

import React, { useState } from 'react'
import { Responsive as ResponsiveGridLayout, Layout } from 'react-grid-layout'
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
  maxW: number
  maxH: number
}

export default function AuthenticatedPage() {
  const [activeWidgets, setActiveWidgets] = useState<string[]>([
    'feed',
    'recipe',
    'timer',
    'conversion',
  ])

  const defaultWidth = 2 // Default width based on TimerWidget
  const defaultHeight = 7 // Default height based on TimerWidget

  const [layout, setLayout] = useState<CustomLayout[]>([
    {
      i: 'feed',
      x: 0,
      y: 0,
      w: defaultWidth,
      h: defaultHeight,
      minW: 2,
      minH: 7,
      maxW: 7,
      maxH: 7,
    },
    {
      i: 'recipe',
      x: 2,
      y: 0,
      w: defaultWidth,
      h: defaultHeight,
      minW: 2,
      minH: 7,
      maxW: 7,
      maxH: 7,
    },
    {
      i: 'timer',
      x: 0,
      y: 1,
      w: defaultWidth,
      h: defaultHeight,
      minW: 2,
      minH: 7,
      maxW: 7,
      maxH: 7,
    },
    {
      i: 'conversion',
      x: 2,
      y: 1,
      w: defaultWidth,
      h: defaultHeight,
      minW: 2,
      minH: 7,
      maxW: 7,
      maxH: 7,
    },
  ])

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout as CustomLayout[])
    const newOrder = newLayout.map((item) => item.i)
    setActiveWidgets(newOrder)
  }

  const renderWidgets = () => {
    return activeWidgets.map((widget) => (
      <div
        key={widget}
        className='widget border border-github-border-default shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer min-h-[150px] flex flex-col'
      >
        <div className='widget-header cursor-move bg-github-canvas-subtle p-4 rounded-t-md'>
          <h3 className='text-github-fg-default font-bold text-center'>
            {widget.charAt(0).toUpperCase() + widget.slice(1)} Widget
          </h3>
        </div>
        {widget === 'feed' && <FeedWidget />}
        {widget === 'recipe' && <RecipeWidget />}
        {widget === 'timer' && <TimerWidget />}
        {widget === 'conversion' && <ConversionWidget />}
      </div>
    ))
  }

  return (
    <DualSidebarLayout isLeftSidebarExpanded={true}>
      <DashboardSidebar setActiveWidgets={setActiveWidgets} />
      <div className='container overflow-x-hidden'>
        <ResponsiveGridLayout
          className='layout'
          layouts={{ lg: layout, md: layout, sm: layout.map((item) => ({ ...item, w: 1 })) }}
          onLayoutChange={onLayoutChange}
          cols={{ lg: 6, md: 3, sm: 1 }}
          rowHeight={80}
          width={window.innerWidth - 32}
          draggableHandle='.widget-header'
          isResizable={true}
          isDraggable={true}
          preventCollision={true}
        >
          {renderWidgets()}
        </ResponsiveGridLayout>
      </div>
    </DualSidebarLayout>
  )
}

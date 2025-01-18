'use client'

import React, { ReactNode, Suspense } from 'react'
import { HydrationLoader } from '@/app/api/loading/HydrationLoader'

interface NewsLayoutProps {
  children: ReactNode
}

const NewsLayout: React.FC<NewsLayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
      <HydrationLoader>
        <Suspense fallback={<div className='text-center py-10'>Loading...</div>}>
          <main className='container mx-auto px-4 py-6'>{children}</main>
        </Suspense>
      </HydrationLoader>
    </div>
  )
}

export default NewsLayout

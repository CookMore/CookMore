'use client'

import React from 'react'
import JobsClient from './JobsClient'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'
import JobsLoadingSkeleton from './ui/JobsLoadingSkeleton'
import { PanelProvider } from '@/app/api/providers/features/PanelProvider'

const JobsPage: React.FC = () => {
  return (
    <PanelProvider>
      <Suspense fallback={<JobsLoadingSkeleton />}>
        <JobsClient />
      </Suspense>
      <PanelContainer />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </PanelProvider>
  )
}

export default JobsPage

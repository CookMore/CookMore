'use client'

import React from 'react'
import NotesClient from './NotesClient'
import { NotesProvider } from './context/NotesContext'
import { BatchProvider } from './context/BatchContext'
import { ThemeProvider } from '@/app/api/providers/core/ThemeProvider'
import { PanelProvider } from '@/app/api/providers/features/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'

const NotesPage: React.FC = () => {
  return (
    <ThemeProvider>
      <PanelProvider>
        <Suspense fallback={<div className='text-center py-10'>Loading...</div>}>
          <main className='container mx-auto px-4 py-6'>
            <NotesProvider>
              <BatchProvider>
                <NotesClient />
              </BatchProvider>
            </NotesProvider>
          </main>
        </Suspense>
        <PanelContainer />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </PanelProvider>
    </ThemeProvider>
  )
}

export default NotesPage

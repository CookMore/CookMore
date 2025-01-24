import React, { ReactNode, Suspense } from 'react'
import { PanelProvider } from '@/app/api/providers/features/PanelProvider'
import { PanelContainer } from '@/app/api/panels/PanelContainer'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const NotesLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
      <PanelProvider>
        <Suspense fallback={<div className='text-center py-10'>Loading...</div>}>
          <main className='container mx-auto px-4 py-6'>{children}</main>
        </Suspense>
        <PanelContainer />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </PanelProvider>
    </div>
  )
}

export default NotesLayout

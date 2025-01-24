'use client'

import React from 'react'
import NotesLayout from './layout'
import NotesClient from './NotesClient'
import { NotesProvider } from './context/NotesContext'
import { BatchProvider } from './context/BatchContext'
import { ThemeProvider } from '@/app/api/providers/core/ThemeProvider'

const NotesPage: React.FC = () => {
  return (
    <ThemeProvider>
      <NotesLayout>
        <NotesProvider>
          <BatchProvider>
            <NotesClient />
          </BatchProvider>
        </NotesProvider>
      </NotesLayout>
    </ThemeProvider>
  )
}

export default NotesPage

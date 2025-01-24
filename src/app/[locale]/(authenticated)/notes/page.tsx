'use client'

import React from 'react'
import NotesLayout from './layout'
import NotesClient from './NotesClient'
import { NotesProvider } from './context/NotesContext'
import { BatchProvider } from './context/BatchContext'

const NotesPage: React.FC = () => {
  return (
    <NotesLayout>
      <NotesProvider>
        <BatchProvider>
          <NotesClient />
        </BatchProvider>
      </NotesProvider>
    </NotesLayout>
  )
}

export default NotesPage

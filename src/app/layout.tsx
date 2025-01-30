'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import { getDB } from './api/database/IndexedDB'
import { IDBPDatabase } from 'idb'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize the IndexedDB database when the component mounts
    getDB()
      .then((db: IDBPDatabase) => {
        // Log a detailed message indicating successful initialization
        console.log('Database initialized successfully:', db.name)
        console.log('Database version:', db.version)
        console.log('Object stores:', Array.from(db.objectStoreNames))
      })
      .catch((error: unknown) => {
        // Log any errors that occur during initialization
        console.error('Error initializing database:', error)
      })

    // Developer Note:
    // This useEffect hook ensures that the IndexedDB is initialized when the application loads.
    // The database instance is not used directly here but is available globally through the getDB() function.
    // This setup allows other parts of the application to access the database as needed.
  }, [])

  return (
    <html lang='en' className={inter.variable} data-theme='dark'>
      <body className='bg-github-canvas-default flex min-h-screen flex-col'>{children}</body>
    </html>
  )
}

import { useState, useEffect } from 'react'
import type { ChangeLogEntry } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useChangeLog() {
  const [changeLogEntries, setChangeLogEntries] = useState<ChangeLogEntry[]>([])

  useEffect(() => {
    // Example: Load initial change log entries from a source
    const loadInitialEntries = async () => {
      try {
        // Fetch or initialize entries here
        const initialEntries: ChangeLogEntry[] = [] // Replace with actual data source
        setChangeLogEntries(initialEntries)
      } catch (error) {
        console.error('Failed to load initial change log entries:', error)
      }
    }

    loadInitialEntries()
  }, []) // Empty dependency array means this runs once on mount

  const addChangeLogEntry = async (description: string) => {
    try {
      const newChange: ChangeLogEntry = {
        version: '1.0',
        type: 'update',
        date: new Date().toISOString(),
        author: 'user',
        message: description,
      }

      setChangeLogEntries((prevEntries) => [...prevEntries, newChange])
    } catch (error) {
      console.error('Failed to add change:', error)
      throw error
    }
  }

  const clearChangelog = async () => {
    try {
      setChangeLogEntries([])
    } catch (error) {
      console.error('Failed to clear changelog:', error)
      throw error
    }
  }

  return {
    changeLogEntries,
    addChangeLogEntry,
    clearChangelog,
  }
}

'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getDB } from '@/app/api/database/IndexedDB'
import { fetchJobs } from '../services/server/jobs.service'
import { useQuery } from '@tanstack/react-query'

export interface Job {
  id: number
  title: string
  description: string
  location: string
  requiredSkills: string
  tierKey: '3-months' | '6-months' | '1-year'
  createdAt: number
  attestationUID?: string
}

interface JobsContextType {
  jobs: Job[]
  addJob: (job: Job) => Promise<void>
  updateJob: (job: Job) => Promise<void>
  removeJob: (jobId: number) => Promise<void>
  syncJobs: () => Promise<void>
  error: string | null
}

const JobsContext = createContext<JobsContextType | undefined>(undefined)

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch jobs from blockchain
  const {
    data: blockchainJobs,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    refetchOnWindowFocus: false,
  })

  // Load from IndexedDB on mount
  useEffect(() => {
    ;(async () => {
      try {
        console.log('📡 Fetching jobs from IndexedDB')
        const db = await getDB()
        const tx = db.transaction('jobs', 'readonly')
        const store = tx.objectStore('jobs')
        const storedJobs = await store.getAll()

        const unifiedJobs = mergeJobs(storedJobs, blockchainJobs || [])
        setJobs(unifiedJobs)
      } catch (err: any) {
        console.error('❌ Error loading jobs from IndexedDB:', err)
        setError(err.message || 'Failed to load jobs from IndexedDB.')
      }
    })()
  }, [blockchainJobs])

  const syncJobs = useCallback(async () => {
    try {
      console.log('🔄 Syncing jobs from blockchain')
      const blockchainData = await fetchJobs()
      const db = await getDB()
      const tx = db.transaction('jobs', 'readwrite')
      const store = tx.objectStore('jobs')

      for (const job of blockchainData) {
        await store.put(job)
      }

      setJobs(blockchainData)
    } catch (err: any) {
      console.error('❌ Failed to sync jobs:', err)
      setError(err.message || 'Error syncing jobs.')
    }
  }, [])

  return (
    <JobsContext.Provider
      value={{
        jobs,
        addJob: async () => {},
        updateJob: async () => {},
        removeJob: async () => {},
        syncJobs,
        error,
      }}
    >
      {children}
    </JobsContext.Provider>
  )
}

const mergeJobs = (localJobs: Job[], blockchainJobs: Job[]): Job[] => {
  const blockchainIds = new Set(blockchainJobs.map((job) => job.id))
  return [...blockchainJobs, ...localJobs.filter((job) => !blockchainIds.has(job.id))]
}

export const useJobs = () => {
  const ctx = useContext(JobsContext)
  if (!ctx) throw new Error('useJobs must be used within a JobsProvider')
  return ctx
}

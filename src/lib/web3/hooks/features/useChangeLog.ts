'use client'

import { useState, useCallback } from 'react'
import { useContract } from '../contracts/useContract'
import { CHANGELOG_ABI } from '@/lib/web3/abis'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export interface ChangeLogEntry {
  timestamp: number
  description: string
  author: string
}

export function useChangeLog() {
  const t = useTranslations('changelog')
  const [entries, setEntries] = useState<ChangeLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { contract: wagmiContract, write, read } = useContract('CHANGELOG', CHANGELOG_ABI)

  const addEntry = useCallback(
    async (description: string) => {
      try {
        setIsLoading(true)
        toast.loading(t('entry.adding'))

        const hash = await write('addEntry', [description])
        await getEntries()
        
        toast.success(t('entry.added'))
        return hash
      } catch (error) {
        console.error('Error adding changelog entry:', error)
        toast.error(t('entry.error'))
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [write, t]
  )

  const getEntries = useCallback(async () => {
    try {
      setIsLoading(true)
      toast.loading(t('entries.loading'))
      
      const entries = await read('getEntries', [])
      setEntries(entries)
      return entries
    } catch (error) {
      console.error('Error getting changelog entries:', error)
      toast.error(t('entries.error'))
      return []
    } finally {
      setIsLoading(false)
    }
  }, [read, t])

  return {
    entries,
    isLoading,
    addEntry,
    getEntries,
    contract: wagmiContract,
  }
}

'use client'

import { useState, useCallback } from 'react'
import { useContract } from './useContract'
import { CHANGELOG_ABI } from '@/lib/web3/abis'
import { CHANGELOG_ADDRESS } from '@/lib/web3/addresses'

interface ChangeLogEntry {
  timestamp: number
  description: string
  author: string
}

export function useChangeLog() {
  const [entries, setEntries] = useState<ChangeLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const contract = useContract(CHANGELOG_ADDRESS, CHANGELOG_ABI)

  const addEntry = useCallback(
    async (description: string) => {
      if (!contract) return

      try {
        setIsLoading(true)
        // TODO: Implement contract interaction
        const tx = await contract.addEntry(description)
        await tx.wait()

        // Refresh entries
        const newEntries = await contract.getEntries()
        setEntries(newEntries)
      } catch (error) {
        console.error('Error adding changelog entry:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [contract]
  )

  const getEntries = useCallback(async () => {
    if (!contract) return []

    try {
      setIsLoading(true)
      const entries = await contract.getEntries()
      setEntries(entries)
      return entries
    } catch (error) {
      console.error('Error getting changelog entries:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [contract])

  return {
    entries,
    isLoading,
    addEntry,
    getEntries,
  }
}

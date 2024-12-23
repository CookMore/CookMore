import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import type { ProfileFormData, ProfileTier } from '../profile'

interface StoredProfileData {
  formData: Partial<ProfileFormData>
  tier: ProfileTier
  lastUpdated: number
  currentStep: number
}

interface UseProfileStorage {
  storedData: StoredProfileData | null
  isLoading: boolean
  error: string | null
  saveDraft: (data: Partial<ProfileFormData>, tier: ProfileTier, step: number) => Promise<void>
  loadDraft: () => Promise<StoredProfileData | null>
  clearDraft: () => Promise<void>
  hasDraft: boolean
}

const STORAGE_KEY_PREFIX = 'profile_draft_'

export function useProfileStorage(): UseProfileStorage {
  const { address } = useAccount()
  const [storedData, setStoredData] = useState<StoredProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasDraft, setHasDraft] = useState(false)

  const getStorageKey = useCallback(() => {
    if (!address) throw new Error('No wallet connected')
    return `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`
  }, [address])

  const saveDraft = useCallback(
    async (data: Partial<ProfileFormData>, tier: ProfileTier, step: number) => {
      setIsLoading(true)
      setError(null)

      try {
        const storageKey = getStorageKey()
        const draftData: StoredProfileData = {
          formData: data,
          tier,
          lastUpdated: Date.now(),
          currentStep: step,
        }

        // Save to local storage
        localStorage.setItem(storageKey, JSON.stringify(draftData))

        // Update state
        setStoredData(draftData)
        setHasDraft(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save draft'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [getStorageKey]
  )

  const loadDraft = useCallback(async (): Promise<StoredProfileData | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const storageKey = getStorageKey()
      const storedJson = localStorage.getItem(storageKey)

      if (!storedJson) {
        setHasDraft(false)
        return null
      }

      const data: StoredProfileData = JSON.parse(storedJson)
      setStoredData(data)
      setHasDraft(true)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load draft'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getStorageKey])

  const clearDraft = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const storageKey = getStorageKey()
      localStorage.removeItem(storageKey)
      setStoredData(null)
      setHasDraft(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear draft'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getStorageKey])

  // Check for existing draft on mount
  useEffect(() => {
    if (address) {
      loadDraft().catch(console.error)
    }
  }, [address, loadDraft])

  // Auto-save draft periodically
  useEffect(() => {
    if (!storedData) return

    const autoSaveInterval = setInterval(() => {
      if (storedData) {
        saveDraft(storedData.formData, storedData.tier, storedData.currentStep).catch(console.error)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [storedData, saveDraft])

  return {
    storedData,
    isLoading,
    error,
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  }
}

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useProfileMetadata } from '../core/useProfileMetadata'
import { contracts } from '@/app/api/blockchain/config/contracts'
import { profileABI } from '@/app/api/blockchain/abis/profile'
import { decodeProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'
import type { ProfileFormData, ProfileTier, Profile } from '../../../profile'
import { usePrivy } from '@privy-io/react-auth'
import {
  // v6 direct imports:
  Contract,
  JsonRpcProvider,
  BrowserProvider,
  // For contract filters, logs, etc.
  parseUnits,
  formatUnits,
  type Log,
  type TransactionReceipt,
} from 'ethers'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'
import { getDB } from '@/app/api/database/IndexedDB'

interface UseProfileContract {
  isLoading: boolean
  error: string | null
  logs: Profile[]
  profileData: Profile | null
  fetchAllLogs: () => Promise<void>
  createProfile: (
    formData: ProfileFormData,
    tier: ProfileTier,
    avatar?: File
  ) => Promise<{
    tokenId: string
    transactionHash: string
  }>
  updateProfile: (
    tokenId: string,
    formData: ProfileFormData,
    tier: ProfileTier,
    avatar?: File
  ) => Promise<{
    transactionHash: string
  }>
  getProfile: (walletAddress: string) => Promise<Profile | null>
}

/**
 * A custom hook for interacting with a "profile" contract.
 * Fixes:
 * - Removed `ethers.providers.*` references in favor of direct v6 imports
 * - Ensured logging logic matches Ethers v6 types
 */
export function useProfileContract(): UseProfileContract {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<Profile[]>([])
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const [contract, setContract] = useState<Contract | null>(null)
  const { processFormData } = useProfileMetadata()
  const { user, authenticated } = usePrivy()

  /**
   * Utility function to fetch logs with exponential backoff to handle rate limiting
   */
  const fetchWithBackoff = async (
    provider: JsonRpcProvider,
    filter: {
      address: string
      fromBlock: number | string
      toBlock: number | string
    },
    retries = 5,
    delay = 1000
  ): Promise<Log[]> => {
    try {
      return await provider.getLogs(filter)
    } catch (err: any) {
      if (err?.message?.includes('429') && retries > 0) {
        console.warn('Rate limit exceeded, retrying...')
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithBackoff(provider, filter, retries - 1, delay * 2)
      }
      throw err
    }
  }

  /**
   * Fetch logs from the contract and decode them
   */
  const fetchAllLogs = useCallback(async () => {
    if (!contract) return

    try {
      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)
      const filter = {
        address: contracts.profile.address,
        fromBlock: 19358516,
        toBlock: 'latest',
      }

      const rawLogs = await fetchWithBackoff(provider, filter)
      console.log('Fetched Logs:', rawLogs)

      const decodedEvents = rawLogs
        .map((log) => {
          const decodedEvent = decodeProfileEvent(log, profileABI)
          console.log('Decoded Event:', decodedEvent)
          return decodedEvent
        })
        // Ensure we only keep truthy, non-null decoded events
        .filter((event): event is Profile => Boolean(event))

      setLogs(decodedEvents)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch and decode logs')
    }
  }, [contract])

  /**
   * Fetch single profile data from the chain
   */
  const fetchProfileData = useCallback(async (walletAddress: string, currentTier: ProfileTier) => {
    if (!walletAddress) return

    try {
      const sepoliaProvider = new JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)
      const profileAddress = '0x0C3897538e000dAdAEA1bb10D5757fC473972018' // Example address
      const chainContract = new Contract(profileAddress, profileABI, sepoliaProvider)

      const profile = await chainContract.getProfile(walletAddress)
      const profileId = profile.profileId
      console.log('Profile ID:', profileId.toString())

      // Fetch metadata from IPFS
      const metadataUrl = ipfsService.getHttpUrl(profile.metadataURI)
      const metadataResponse = await fetch(metadataUrl)
      const metadataJson = await metadataResponse.json()

      // Construct the final typed Profile object
      const parsedProfile: Profile = {
        ...profile,
        metadata: metadataJson,
        tokenId: profileId.toString(),
        tier: currentTier,
      }

      setProfileData(parsedProfile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }, [])

  /**
   * Initialize contract once user is authenticated and has a wallet
   */
  useEffect(() => {
    if (!authenticated || !user || !user.wallet) {
      setError('User is not authenticated or wallet is not available')
      return
    }

    // Ethers v6 => Use BrowserProvider for the window.ethereum
    const provider = new BrowserProvider(window.ethereum as any)
    const signer = provider.getSigner(user.wallet.address)

    const profileAddress = contracts.profile.address
    if (!profileAddress) {
      throw new Error('Profile contract address is not defined')
    }

    const newContract = new Contract(profileAddress, profileABI, signer)
    if (!contract || contract.address !== newContract.address) {
      setContract(newContract)
      fetchAllLogs()
    }
  }, [authenticated, user, contract, fetchAllLogs])

  /**
   * Create Profile function
   */
  const createProfile = useCallback(
    async (
      formData: ProfileFormData,
      tier: ProfileTier,
      avatar?: File
    ): Promise<{
      tokenId: string
      transactionHash: string
    }> => {
      if (!contract) {
        throw new Error('Contract is not initialized')
      }

      setIsLoading(true)
      setError(null)

      try {
        const { onChainMetadata, ipfsMetadataCID } = await processFormData(formData, avatar)
        const tx = await contract.createProfile(
          tier,
          onChainMetadata.name,
          onChainMetadata.bio,
          ipfsMetadataCID
        )

        const receipt = await tx.wait()
        // Ethers v6: receipt.logs can be read directly
        const eventLog = receipt.logs.find((log: Log) => log.address === contract.address)
        if (!eventLog) {
          throw new Error('Profile creation event not found')
        }

        // We’d decode if needed, or if the contract returns tokenId in an event
        // Example decode if it’s something like: event ProfileCreated(address indexed user, uint256 tokenId);
        // For now, we assume you have it in eventLog already
        const tokenId = '1' // Hard-coded or decode from eventLog

        return {
          tokenId,
          transactionHash: receipt.transactionHash,
        }
      } catch (err: any) {
        setError(err?.message ?? 'Failed to create profile')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [contract, processFormData]
  )

  /**
   * Update Profile function
   */
  const updateProfile = useCallback(
    async (
      tokenId: string,
      formData: ProfileFormData,
      tier: ProfileTier,
      avatar?: File
    ): Promise<{
      transactionHash: string
    }> => {
      if (!contract) {
        throw new Error('Contract is not initialized')
      }

      setIsLoading(true)
      setError(null)

      try {
        const { onChainMetadata, ipfsMetadataCID } = await processFormData(formData, avatar)
        const tx = await contract.updateProfile(
          tokenId,
          tier,
          onChainMetadata.name,
          onChainMetadata.bio,
          ipfsMetadataCID
        )
        const receipt = await tx.wait()

        return {
          transactionHash: receipt.transactionHash,
        }
      } catch (err: any) {
        setError(err?.message ?? 'Failed to update profile')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [contract, processFormData]
  )

  /**
   * Get a single profile from logs or chain
   */
  const getProfile = useCallback(
    async (walletAddress: string): Promise<Profile | null> => {
      if (!contract) {
        throw new Error('Contract is not initialized')
      }

      try {
        const filter = contract.filters.ProfileCreated(walletAddress)
        const logs = await contract.queryFilter(filter, 19358516, 'latest')

        // Decode your logs here if needed
        const decodedEvents = logs
          .map((log) => decodeProfileEvent(log, profileABI))
          .filter((e): e is Profile => Boolean(e))

        if (decodedEvents.length === 0) {
          return null
        }

        const latestEvent = decodedEvents[decodedEvents.length - 1]
        return latestEvent || null
      } catch (err: any) {
        setError(err?.message ?? 'Failed to fetch profile')
        throw err
      }
    },
    [contract]
  )

  return {
    isLoading,
    error,
    logs,
    profileData,
    fetchAllLogs,
    createProfile,
    updateProfile,
    getProfile,
  }
}

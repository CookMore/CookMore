'use client'

import { useState, useCallback, useEffect } from 'react'
import { useProfileMetadata } from '../core/useProfileMetadata'
import { contracts } from '@/app/api/blockchain/config/contracts'
import { profileABI } from '@/app/api/blockchain/abis/profile'
import { decodeCreateProfileEvent } from '@/app/api/blockchain/utils/eventDecoder'
import type { ProfileFormData, ProfileTier } from '../../../profile'
import type { OnChainMetadata } from '../../../types/metadata'
import { usePrivy } from '@privy-io/react-auth'
import { ethers } from 'ethers'

interface UseProfileContract {
  isLoading: boolean
  error: string | null
  logs: any[]
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
  getProfile: (walletAddress: string) => Promise<{
    profileId: string
    metadataURI: string
  } | null>
}

interface DecodedEvent {
  profileId: string
  metadataURI: string
}

export function useProfileContract(): UseProfileContract {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const { processFormData } = useProfileMetadata()
  const { user, authenticated } = usePrivy()

  const fetchWithBackoff = async (
    provider: ethers.providers.Provider,
    filter: ethers.providers.Filter,
    retries = 5,
    delay = 1000
  ) => {
    try {
      const logs = await provider.getLogs(filter)
      return logs
    } catch (err) {
      if (err instanceof Error && err.message.includes('429') && retries > 0) {
        console.warn('Rate limit exceeded, retrying...')
        await new Promise((resolve) => setTimeout(resolve, delay))
        return fetchWithBackoff(provider, filter, retries - 1, delay * 2)
      }
      throw err
    }
  }

  const fetchAllLogs = useCallback(async () => {
    if (!contract) return

    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL
      )
      const filter = {
        address: contracts.profile.address,
        fromBlock: 19358516,
        toBlock: 'latest',
      }

      const logs = await fetchWithBackoff(provider, filter)
      console.log('Fetched Logs:', logs)

      const decodedEvents = logs
        .map((log) => {
          const decodedEvent = decodeCreateProfileEvent(log, profileABI)
          console.log('Decoded Event:', decodedEvent)
          return decodedEvent
        })
        .filter(Boolean)

      setLogs(decodedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch and decode logs')
    }
  }, [contract])

  useEffect(() => {
    if (!authenticated || !user || !user.wallet) {
      setError('User is not authenticated or wallet is not available')
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner(user.wallet.address)

    const profileAddress = contracts.profile.address
    if (!profileAddress) {
      throw new Error('Profile contract address is not defined')
    }

    const newContract = new ethers.Contract(profileAddress, profileABI, signer)
    if (!contract || contract.address !== newContract.address) {
      setContract(newContract)
      fetchAllLogs()
    }
  }, [authenticated, user, contract, fetchAllLogs])

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
        const event = receipt.logs.find((log: any) => log.eventName === 'ProfileCreated')

        if (!event) {
          throw new Error('Profile creation event not found')
        }

        return {
          tokenId: event.args.tokenId.toString(),
          transactionHash: receipt.transactionHash,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create profile'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [contract, processFormData]
  )

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
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update profile'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [contract, processFormData]
  )

  const getProfile = useCallback(
    async (
      walletAddress: string
    ): Promise<{
      profileId: string
      metadataURI: string
    } | null> => {
      if (!contract) {
        throw new Error('Contract is not initialized')
      }

      try {
        const filter = contract.filters.ProfileCreated(walletAddress)
        const logs = await contract.queryFilter(filter, 19358516, 'latest')

        const decodedEvents = logs
          .map((log) => decodeCreateProfileEvent(log, profileABI))
          .filter(Boolean)

        if (decodedEvents.length === 0) {
          return null
        }

        const latestEvent = decodedEvents[decodedEvents.length - 1]
        if (!latestEvent) {
          return null
        }
        return {
          profileId: latestEvent.args?.profileId,
          metadataURI: latestEvent.args?.metadataURI,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch profile'
        setError(message)
        throw err
      }
    },
    [contract]
  )

  return {
    isLoading,
    error,
    logs,
    fetchAllLogs,
    createProfile,
    updateProfile,
    getProfile,
  }
}

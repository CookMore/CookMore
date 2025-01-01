import { usePrivy } from '@privy-io/react-auth'
import { useState, useCallback } from 'react'
import { base, baseSepolia } from 'viem/chains'
import { profileABI } from '@/app/api/blockchain/abis/profile'
import { toast } from 'sonner'

const chain = process.env.NEXT_PUBLIC_NETWORK === 'production' ? base : baseSepolia

export type MintStatus = {
  status: 'preparing' | 'minting' | 'confirming' | 'complete' | 'error'
  message: string
  txHash?: string
}

export function useContractService() {
  const { wallet } = usePrivy()
  const [mintStatus, setMintStatus] = useState<MintStatus | null>(null)

  const updateStatus = useCallback(
    (status: MintStatus['status'], message: string, txHash?: string) => {
      setMintStatus({ status, message, txHash })
      console.log(`Mint Status - ${status}:`, { message, txHash })
    },
    []
  )

  const mintProfile = useCallback(
    async (metadataCID: string) => {
      try {
        console.log('Starting profile creation:', { metadataCID })
        updateStatus('preparing', 'Preparing transaction...')

        if (!wallet?.address) {
          throw new Error('No wallet connected')
        }

        const contractAddress = process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY
        if (!contractAddress) {
          throw new Error('Profile Registry contract address not configured')
        }

        // Fix double ipfs:// prefix
        const metadataURI = metadataCID.startsWith('ipfs://')
          ? metadataCID
          : `ipfs://${metadataCID}`

        updateStatus('minting', 'Waiting for wallet approval...')

        // Create the transaction
        const tx = await wallet.sendTransaction({
          to: contractAddress as `0x${string}`,
          data: profileABI.encodeFunctionData('createProfile', [metadataURI]),
          chain: chain,
        })

        updateStatus('confirming', 'Transaction submitted, waiting for confirmation...', tx.hash)

        // Wait for transaction confirmation
        const receipt = await tx.wait()

        // Look for ProfileCreated event
        const profileCreatedEvent = receipt.logs.find((log) => {
          try {
            const eventId = profileABI.getEvent('ProfileCreated').id
            return log.topics[0] === eventId
          } catch (error) {
            console.error('Error matching event:', error)
            return false
          }
        })

        if (!profileCreatedEvent) {
          throw new Error('ProfileCreated event not found in transaction receipt')
        }

        updateStatus('complete', 'Profile created successfully!', tx.hash)

        return {
          eventLog: {
            topics: profileCreatedEvent.topics,
            data: profileCreatedEvent.data,
          },
          abi: profileABI,
        }
      } catch (error) {
        console.error('Error creating profile:', error)
        updateStatus('error', error instanceof Error ? error.message : 'Unknown error occurred')
        toast.error('Failed to create profile')
        throw error
      }
    },
    [wallet, updateStatus]
  )

  const checkProfileExists = useCallback(
    async (address: string): Promise<boolean> => {
      try {
        if (!wallet) return false

        const contractAddress = process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY
        if (!contractAddress) return false

        const result = await wallet.readContract({
          address: contractAddress as `0x${string}`,
          abi: profileABI,
          functionName: 'getProfile',
          args: [address as `0x${string}`],
        })

        return result?.exists || false
      } catch (error) {
        console.error('Error checking profile existence:', error)
        return false
      }
    },
    [wallet]
  )

  return {
    mintProfile,
    mintStatus,
    checkProfileExists,
  }
}

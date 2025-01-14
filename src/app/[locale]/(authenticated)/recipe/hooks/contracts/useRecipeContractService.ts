import { usePrivy } from '@privy-io/react-auth'
import { useState, useCallback } from 'react'
import { base, baseSepolia } from 'viem/chains'
import { recipeABI } from '@/app/api/blockchain/abis/recipe'
import { toast } from 'sonner'

const chain = process.env.NEXT_PUBLIC_NETWORK === 'production' ? base : baseSepolia

export type RecipeMintStatus = {
  status: 'preparing' | 'minting' | 'confirming' | 'complete' | 'error'
  message: string
  txHash?: string
}

export function useRecipeContractService() {
  const { wallet } = usePrivy()
  const [mintStatus, setMintStatus] = useState<RecipeMintStatus | null>(null)

  const updateStatus = useCallback(
    (status: RecipeMintStatus['status'], message: string, txHash?: string) => {
      setMintStatus({ status, message, txHash })
      console.log(`Mint Status - ${status}:`, { message, txHash })
    },
    []
  )

  const mintRecipe = useCallback(
    async (metadataCID: string) => {
      try {
        console.log('Starting recipe minting:', { metadataCID })
        updateStatus('preparing', 'Preparing transaction...')

        if (!wallet?.address) {
          throw new Error('No wallet connected')
        }

        const contractAddress = process.env.NEXT_PUBLIC_TESTNET_RECIPE_REGISTRY
        if (!contractAddress) {
          throw new Error('Recipe Registry contract address not configured')
        }

        const metadataURI = metadataCID.startsWith('ipfs://')
          ? metadataCID
          : `ipfs://${metadataCID}`

        updateStatus('minting', 'Waiting for wallet approval...')

        const tx = await wallet.sendTransaction({
          to: contractAddress as `0x${string}`,
          data: recipeABI.encodeFunctionData('createRecipe', [metadataURI]),
          chain: chain,
        })

        updateStatus('confirming', 'Transaction submitted, waiting for confirmation...', tx.hash)

        const receipt = await tx.wait()

        const recipeCreatedEvent = receipt.logs.find((log: any) => {
          try {
            const eventId = recipeABI.getEvent('RecipeCreated').id
            return log.topics[0] === eventId
          } catch (error) {
            console.error('Error matching event:', error)
            return false
          }
        })

        if (!recipeCreatedEvent) {
          throw new Error('RecipeCreated event not found in transaction receipt')
        }

        updateStatus('complete', 'Recipe minted successfully!', tx.hash)

        return {
          eventLog: {
            topics: recipeCreatedEvent.topics,
            data: recipeCreatedEvent.data,
          },
          abi: recipeABI,
        }
      } catch (error) {
        console.error('Error minting recipe:', error)
        updateStatus('error', error instanceof Error ? error.message : 'Unknown error occurred')
        toast.error('Failed to mint recipe')
        throw error
      }
    },
    [wallet, updateStatus]
  )

  return {
    mintRecipe,
    mintStatus,
  }
}

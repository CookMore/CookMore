'use client'

import { useState } from 'react'
import { useContractWrite, useWaitForTransactionReceipt } from 'wagmi'
import { useLocalStorage } from '@/lib/ui/hooks/useLocalStorage'
import { IconSpinner } from '@/components/ui/icons'
import { RecipeData, RecipeMetadata } from '@/app/api/types/recipe'
import { StepComponentProps } from './index'

// Contract addresses on Base Testnet
const RECIPE_NFT_ADDRESS = '0xd34050d9C75c70D7CA270FAe58B0Ce8c303722fa' as const

interface Reviewer {
  address: string
  hasSigned: boolean
  signature?: string
  timestamp?: number
}

export function Mint({ data, onChange, onNext, onBack }: StepComponentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recipeData] = useLocalStorage<RecipeData>('recipe-draft', null)
  const [reviewers, setReviewers] = useState<Reviewer[]>([])

  // Updated contract write hook with proper wagmi v2 types
  const {
    write: mintRecipe,
    data: mintTxHash,
    isPending: isMinting,
    isSuccess,
  } = useContractWrite({
    address: RECIPE_NFT_ADDRESS,
    abi: RECIPE_NFT_ABI,
    functionName: 'safeMint',
  })

  // Use waitForTransactionReceipt for transaction status
  const { isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  })

  // Add reviewer
  const addReviewer = (address: string) => {
    if (!address) return
    setReviewers((prev) => [...prev, { address, hasSigned: false }])
  }

  // Check if all reviewers have signed
  const allReviewersSigned = reviewers.length > 0 && reviewers.every((r) => r.hasSigned)

  // Handle minting
  const handleMint = async () => {
    if (!recipeData || !mintRecipe) return

    try {
      setIsLoading(true)

      // Combine all signatures and recipe data
      const finalMetadata: RecipeMetadata = {
        ...recipeData,
        signatures: reviewers.map((r) => ({
          address: r.address,
          signature: r.signature || '',
          timestamp: r.timestamp,
        })),
      }

      // Upload final metadata to IPFS
      const metadataUri = await uploadToIPFS(finalMetadata)

      // Mint the NFT with proper wagmi v2 call
      const tx = await mintRecipe({
        args: [metadataUri],
      })

      if (isSuccess && onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Minting failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-8'>
      {/* Digital Signatures Section */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-github-fg-default'>Digital Signatures</h3>

        <div className='space-y-4'>
          {reviewers.map((reviewer, index) => (
            <div
              key={reviewer.address}
              className='flex items-center justify-between p-4 rounded-md 
                       border border-github-border-default bg-github-canvas-subtle'
            >
              <span className='text-github-fg-default'>{reviewer.address}</span>
              {reviewer.hasSigned ? (
                <span className='text-github-success-fg'>✓ Signed</span>
              ) : (
                <span className='text-github-danger-fg'>Pending</span>
              )}
            </div>
          ))}

          <button
            onClick={() => addReviewer('')}
            className='w-full p-2 rounded-md border border-dashed 
                     border-github-border-default text-github-fg-muted
                     hover:text-github-fg-default hover:border-github-border-muted
                     transition-colors'
          >
            + Add Reviewer
          </button>
        </div>
      </div>

      {/* Mint Button */}
      <div className='flex justify-end'>
        <button
          onClick={handleMint}
          disabled={!allReviewersSigned || isLoading || isMinting || isWaiting}
          className={`
            px-6 py-2 rounded-md font-medium
            ${
              allReviewersSigned
                ? 'bg-github-accent-emphasis text-github-fg-onEmphasis hover:bg-github-accent-muted'
                : 'bg-github-canvas-subtle text-github-fg-muted cursor-not-allowed'
            }
            transition-colors
          `}
        >
          {isLoading || isMinting || isWaiting ? (
            <span className='flex items-center gap-2'>
              <IconSpinner className='w-4 h-4 animate-spin' />
              {isWaiting ? 'Confirming...' : 'Minting...'}
            </span>
          ) : (
            'Mint Recipe NFT'
          )}
        </button>
      </div>

      {/* Transaction Status */}
      {mintTxHash && (
        <div className='p-4 rounded-md bg-github-success-subtle text-github-success-fg'>
          Transaction submitted! View on{' '}
          <a
            href={mintTxHash ? `https://goerli.basescan.org/tx/${mintTxHash}` : '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='underline'
          >
            BaseScan
          </a>
        </div>
      )}
    </div>
  )
}

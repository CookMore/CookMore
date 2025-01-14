'use client'

import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useRecipe } from '../context/RecipeContext'
import { IconSpinner, IconCheck } from '@/app/api/icons'
import { StepComponentProps } from './index'
import { usePrivacySettings } from '@/app/api/hooks/usePrivacySettings'

interface Signature {
  address: string
  signature: string
  timestamp: number
}

export function Review({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const { address } = useAccount()
  const [signatures, setSignatures] = useState<Signature[]>([])
  const [isSigningMessage, setIsSigningMessage] = useState(false)
  const { privacySettings } = usePrivacySettings()
  const [name, setName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<string>('')

  const choices = ['Option 1', 'Option 2', 'Option 3']

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess(signature, variables) {
        const newSignature: Signature = {
          address: address!,
          signature,
          timestamp: Date.now(),
        }
        setSignatures((prev) => [...prev, newSignature])

        updateRecipe({
          signatures: [...(state.recipeData.signatures || []), newSignature],
        })
      },
    },
  })

  const handleSign = async () => {
    if (!address) return
    setIsSigningMessage(true)
    try {
      const messageToSign = `Recipe Review Signature\n\nRecipe: ${
        state.recipeData.title
      }\nReviewer: ${address}\nTimestamp: ${Date.now()}`
      await signMessage({ message: messageToSign })
    } finally {
      setIsSigningMessage(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      console.log('Saving draft:', {
        ...state.recipeData,
        signatures,
      })
    } catch (error) {
      console.error('Error saving draft:', error)
    }
  }

  const hasUserSigned = signatures.some((sig) => sig.address === address)

  const handleSignOff = () => {
    if (!agreed || !selectedChoice) {
      alert('You must agree to the privacy settings and select an option to sign off.')
      return
    }
    console.log('Signed off by:', name, 'with choice:', selectedChoice)
  }

  if (!privacySettings || !privacySettings.description) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-github-fg-default'>Review & Sign Recipe</h3>
      </div>

      <div className='space-y-4'>
        <h4 className='text-sm font-medium text-github-fg-default'>Digital Signatures</h4>

        <div className='space-y-2'>
          {signatures.map((sig, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 rounded-md 
                       bg-github-canvas-subtle border border-github-border-default'
            >
              <div className='flex items-center space-x-2'>
                <IconCheck className='w-4 h-4 text-github-success-fg' />
                <span className='text-sm text-github-fg-default'>{sig.address}</span>
              </div>
              <span className='text-xs text-github-fg-muted'>
                {new Date(sig.timestamp).toLocaleString()}
              </span>
            </div>
          ))}

          {!hasUserSigned && (
            <button
              onClick={handleSign}
              disabled={isSigningMessage || !address}
              className='w-full p-3 rounded-md border border-dashed 
                       border-github-border-default text-github-fg-muted
                       hover:text-github-fg-default hover:border-github-border-muted
                       transition-colors flex items-center justify-center space-x-2'
            >
              {isSigningMessage ? (
                <>
                  <IconSpinner className='w-4 h-4 animate-spin' />
                  <span>Signing...</span>
                </>
              ) : (
                <span>+ Sign with Connected Wallet</span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className='flex justify-between'>
        <button
          onClick={onBack}
          className='px-4 py-2 text-github-fg-default bg-github-canvas-subtle rounded-md 
                   hover:bg-github-canvas-default'
        >
          Back
        </button>
        <div className='space-x-2'>
          <button
            onClick={handleSaveDraft}
            className='px-4 py-2 text-github-fg-default bg-github-canvas-subtle rounded-md 
                     hover:bg-github-canvas-default'
          >
            Save Draft
          </button>
          <button
            onClick={onNext}
            disabled={!hasUserSigned}
            className={`px-4 py-2 rounded-md transition-colors ${
              hasUserSigned
                ? 'bg-github-success-emphasis text-white hover:bg-github-success-emphasis/90'
                : 'bg-github-canvas-subtle text-github-fg-muted cursor-not-allowed'
            }`}
          >
            Continue to Mint
          </button>
        </div>
      </div>

      <div>
        <h2>Review and Sign Off</h2>
        <div>
          <h3>Privacy Settings</h3>
          <p>{privacySettings.description}</p>
        </div>
        <div>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Your Name'
          />
        </div>
        <div>
          <input type='checkbox' checked={agreed} onChange={() => setAgreed(!agreed)} />
          <label>I agree to the privacy settings</label>
        </div>
        <div>
          <h4>Select an Option</h4>
          {choices.map((choice) => (
            <div key={choice}>
              <input
                type='radio'
                id={choice}
                name='privacyChoice'
                value={choice}
                checked={selectedChoice === choice}
                onChange={() => setSelectedChoice(choice)}
              />
              <label htmlFor={choice}>{choice}</label>
            </div>
          ))}
        </div>
        <button onClick={handleSignOff}>Sign Off</button>
      </div>
    </div>
  )
}

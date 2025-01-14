'use client'

import { useState, useEffect } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { usePrivacySettings } from '@/app/api/hooks/usePrivacySettings'
import { IconAlertCircle, IconLoader } from '@/app/api/icons'
import { BaseStep } from './BaseStep'
import { StepComponentProps } from './index'
import CryptoJS from 'crypto-js'
import { ChefHat, Crown, Users, Star } from 'lucide-react'

// Map visibility to contract privacy types
const PRIVACY_TYPE_MAP = {
  private: 0,
  allowlist: 1,
  public: 2,
} as const

const PRIVACY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'allowlist', label: 'Allowlist' },
]

// Function to encrypt data
const encryptData = (data: any, key: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
}

// Function to decrypt data
const decryptData = (ciphertext: string, key: string): any => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export function PrivacySettings({ onNext, onBack }: StepComponentProps) {
  const { state, updateRecipe } = useRecipe()
  const { setPrivacy, addToAllowlist } = usePrivacySettings()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [newAddress, setNewAddress] = useState('')
  const [walletAddresses, setWalletAddresses] = useState<string[]>([])
  const [isEncrypted, setIsEncrypted] = useState(false) // New state for encryption toggle

  // Assume we have a function to get the user's tier
  const userTier = state.userTier || 'free' // Default to 'free' if not set

  useEffect(() => {
    // Ensure visibility is set to a default value if not already set
    if (!state.recipeData.visibility) {
      updateRecipe({ visibility: 'public' })
    }
  }, [state.recipeData.visibility, updateRecipe])

  const handleVisibilityUpdate = (visibility: 'public' | 'private' | 'allowlist') => {
    updateRecipe({ visibility })
  }

  const handleAddAddress = async (address: string) => {
    if (!address || !address.startsWith('0x')) {
      setError('Invalid Ethereum address')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const newAllowlist = [...(state.recipeData.allowlist || []), address]
      updateRecipe({ allowlist: newAllowlist })
      await addToAllowlist(state.recipeData.id as string, address)
      setNewAddress('')
    } catch (err) {
      setError('Failed to add address to allowlist')
    } finally {
      setIsLoading(false)
    }
  }

  const addWalletAddress = (address: string) => {
    setWalletAddresses([...walletAddresses, address])
  }

  return (
    <BaseStep
      title='Privacy Settings'
      description='Configure the privacy settings for your recipe.'
      data={state.recipeData as any}
      onChange={updateRecipe}
      onNext={onNext}
      onBack={onBack}
      isValid={true}
    >
      <div className='space-y-6'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold'>Select Privacy Setting</h3>
          <div className='flex space-x-4'>
            {PRIVACY_OPTIONS.map((option) => (
              <label key={option.value} className='flex items-center space-x-2'>
                <input
                  type='radio'
                  name='privacy'
                  value={option.value}
                  checked={state.recipeData.visibility === option.value}
                  onChange={() => handleVisibilityUpdate(option.value)}
                  disabled={
                    (option.value === 'private' && userTier === 'free') ||
                    (option.value === 'allowlist' && userTier !== 'group' && userTier !== 'og')
                  }
                  className={`form-radio ${
                    (option.value === 'private' && userTier === 'free') ||
                    (option.value === 'allowlist' && userTier !== 'group' && userTier !== 'og')
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-500'
                  }`}
                />
                <span>{option.label}</span>
                {option.value === 'private' && userTier === 'free' && (
                  <span className='ml-1 text-sm text-gray-500 flex items-center'>
                    <Crown className='w-4 h-4 ml-1' />
                    <Users className='w-4 h-4 ml-1' />
                    <Star className='w-4 h-4 ml-1' />
                  </span>
                )}
                {option.value === 'allowlist' && userTier !== 'group' && userTier !== 'og' && (
                  <span className='ml-1 text-sm text-gray-500 flex items-center'>
                    <Users className='w-4 h-4 ml-1' />
                    <Star className='w-4 h-4 ml-1' />
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div
          className={`card p-4 border rounded shadow ${
            userTier === 'free' ? 'bg-gray-800 pointer-events-none' : ''
          }`}
        >
          <h4 className='text-lg font-semibold'>Encryption</h4>
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={isEncrypted}
              onChange={() => setIsEncrypted(!isEncrypted)}
              className='form-checkbox text-blue-500'
              disabled={userTier === 'free'}
            />
            <span>Encrypt my data</span>
          </label>
          <p className='text-sm text-gray-600'>
            Choose whether to encrypt your recipe data. Encryption will be handled during the
            minting process.
          </p>
        </div>

        {state.recipeData.visibility === 'allowlist' && (
          <div
            className={`card p-4 border rounded shadow ${
              userTier !== 'group' && userTier !== 'og' ? 'bg-gray-800 pointer-events-none' : ''
            }`}
          >
            <h4 className='text-lg font-semibold'>Allowlist Settings</h4>
            <div className='flex gap-2'>
              <input
                type='text'
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder='Enter Ethereum address'
                className={`flex-1 p-2 border rounded ${
                  userTier !== 'group' && userTier !== 'og' ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={userTier !== 'group' && userTier !== 'og'}
              />
              <button
                onClick={() => handleAddAddress(newAddress)}
                disabled={isLoading || !newAddress || (userTier !== 'group' && userTier !== 'og')}
                className='px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50'
              >
                Add
              </button>
            </div>
            {state.recipeData.allowlist?.map((address) => (
              <div
                key={address}
                className='flex items-center justify-between p-2 bg-gray-50 rounded'
              >
                <span className='font-mono text-sm'>{address}</span>
                <button
                  onClick={() => {
                    const newAllowlist = state.recipeData.allowlist?.filter((a) => a !== address)
                    updateRecipe({ allowlist: newAllowlist })
                  }}
                  className='text-red-600 hover:text-red-700'
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className='flex items-center text-red-600'>
            <IconAlertCircle className='w-5 h-5 mr-2' />
            <span>{error}</span>
          </div>
        )}

        {isLoading && (
          <div className='flex items-center text-gray-500'>
            <IconLoader className='w-5 h-5 mr-2 animate-spin' />
            <span>Updating privacy settings...</span>
          </div>
        )}

        <div>
          <h3 className='text-lg font-semibold'>Wallet Addresses</h3>
          <input
            type='text'
            placeholder='Enter wallet address'
            onKeyDown={(e) => {
              const target = e.target as HTMLInputElement
              if (e.key === 'Enter') {
                addWalletAddress(target.value)
                target.value = ''
              }
            }}
            className='p-2 border rounded w-full'
          />
          <ul className='mt-2 space-y-1'>
            {walletAddresses.map((address, index) => (
              <li key={index} className='p-2 bg-gray-50 rounded'>
                {address}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BaseStep>
  )
}

'use client'

import { useState } from 'react'
import { usePrivacySettings } from '@/app/api/hooks/usePrivacySettings'
import { useRecipePreview } from '@/app/api/hooks/useRecipePreview'
import { BaseStep } from './BaseStep'
import { RecipeData } from '@/app/api/types/recipe'
import { IconLock, IconAlertCircle, IconLoader, IconCopy } from '@/components/ui/icons'
import { StepComponentProps } from './index'

// Map visibility to contract privacy types
const PRIVACY_TYPE_MAP = {
  private: 0,
  allowlist: 1,
  public: 2,
} as const

export function PrivacySettings({ data, onChange, onNext, onBack }: StepComponentProps) {
  const { setPrivacy, addToAllowlist } = usePrivacySettings()
  const { updatePreview } = useRecipePreview()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [newAddress, setNewAddress] = useState('')
  const [showKey, setShowKey] = useState(false)

  const encryptionKey = 'user-specific-encryption-key' // Replace with actual key management logic

  const handleVisibilityUpdate = async (visibility: RecipeData['visibility']) => {
    if (!data.id || typeof data.id !== 'string') {
      setError('Invalid recipe ID')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      // Update local state
      const updates: Partial<RecipeData> = {
        visibility,
        allowlist: visibility === 'allowlist' ? [] : undefined,
      }
      onChange(updates)
      await updatePreview('privacy', updates)

      // Update blockchain state
      const privacyType = PRIVACY_TYPE_MAP[visibility || 'private']
      await setPrivacy(data.id, privacyType)
    } catch (err) {
      setError('Failed to update privacy settings')
      onChange({
        visibility: data.visibility,
        allowlist: data.allowlist,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAddress = async (address: string) => {
    if (!data.id || typeof data.id !== 'string') {
      setError('Invalid recipe ID')
      return
    }

    if (!address || !address.startsWith('0x')) {
      setError('Invalid Ethereum address')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const newAllowlist = [...(data.allowlist || []), address]
      onChange({ allowlist: newAllowlist })
      await addToAllowlist(data.id, address)
      setNewAddress('')
    } catch (err) {
      setError('Failed to add address to allowlist')
      onChange({ allowlist: data.allowlist })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(encryptionKey)
    alert('Encryption key copied to clipboard!')
  }

  return (
    <BaseStep
      title='Privacy Settings'
      description='Configure who can access your recipe'
      data={data}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      isValid={!error && !isLoading}
      isSaving={isLoading}
    >
      <div className='space-y-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {/* Public Option */}
          <button
            onClick={() => handleVisibilityUpdate('public')}
            className={`flex items-center p-4 border rounded-lg ${
              data.visibility === 'public' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <IconLock className='w-5 h-5 mr-3 text-gray-500' />
            <div className='text-left'>
              <div className='font-medium'>Public</div>
              <div className='text-sm text-gray-500'>Anyone can view</div>
            </div>
          </button>

          {/* Private Option */}
          <button
            onClick={() => handleVisibilityUpdate('private')}
            className={`flex items-center p-4 border rounded-lg ${
              data.visibility === 'private' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <IconLock className='w-5 h-5 mr-3 text-gray-500' />
            <div className='text-left'>
              <div className='font-medium'>Private</div>
              <div className='text-sm text-gray-500'>Only you can view</div>
            </div>
          </button>

          {/* Allowlist Option */}
          <button
            onClick={() => handleVisibilityUpdate('allowlist')}
            className={`flex items-center p-4 border rounded-lg ${
              data.visibility === 'allowlist' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <IconLock className='w-5 h-5 mr-3 text-gray-500' />
            <div className='text-left'>
              <div className='font-medium'>Allowlist</div>
              <div className='text-sm text-gray-500'>Specific addresses only</div>
            </div>
          </button>
        </div>

        {/* Encryption Key Display for Private Option */}
        {data.visibility === 'private' && (
          <div className='space-y-4'>
            <button onClick={() => setShowKey(!showKey)} className='text-blue-500'>
              {showKey ? 'Hide Encryption Key' : 'Show Encryption Key'}
            </button>
            {showKey && (
              <div className='flex items-center justify-between p-2 bg-gray-50 rounded'>
                <span className='font-mono text-sm'>{encryptionKey}</span>
                <button onClick={handleCopyKey} className='text-blue-500 hover:text-blue-700'>
                  <IconCopy className='w-5 h-5' />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Allowlist Management */}
        {data.visibility === 'allowlist' && (
          <div className='space-y-4'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder='Enter Ethereum address'
                className='flex-1 p-2 border rounded'
              />
              <button
                onClick={() => handleAddAddress(newAddress)}
                disabled={isLoading || !newAddress}
                className='px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50'
              >
                Add
              </button>
            </div>

            {data.allowlist?.map((address) => (
              <div
                key={address}
                className='flex items-center justify-between p-2 bg-gray-50 rounded'
              >
                <span className='font-mono text-sm'>{address}</span>
                <button
                  onClick={() => {
                    const newAllowlist = data.allowlist?.filter((a) => a !== address)
                    onChange({ allowlist: newAllowlist })
                  }}
                  className='text-red-600 hover:text-red-700'
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className='flex items-center text-red-600'>
            <IconAlertCircle className='w-5 h-5 mr-2' />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center text-gray-500'>
            <IconLoader className='w-5 h-5 mr-2 animate-spin' />
            <span>Updating privacy settings...</span>
          </div>
        )}
      </div>
    </BaseStep>
  )
}

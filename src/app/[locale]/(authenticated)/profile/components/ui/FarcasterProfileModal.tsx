// src/app/[locale]/(authenticated)/profile/components/ui/FarcasterProfileModal.tsx
import React, { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children?: ReactNode
}

const FarcasterProfileModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-github-canvas-default w-full max-w-md p-6 rounded-lg shadow-lg relative animate-fade-in border border-github-border-default hover:border-purple-500 transition-colors'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-github-fg-muted hover:text-github-fg-default'
        >
          &times;
        </button>
        <div className='flex items-center mb-4'>
          <img
            src='/icons/brand/farcaster-white-black.svg'
            alt='Farcaster'
            className='h-8 w-8 mr-2'
          />
          <h2 className='text-xl font-semibold text-github-fg-default'>Share on Farcaster</h2>
        </div>
        <div className='mb-4'>
          <p className='text-github-fg-muted'>
            Share your profile on Farcaster to connect with others and showcase your achievements.
          </p>
        </div>
        <div className='border border-github-border-default rounded-md p-4 mb-4 flex justify-center items-center'>
          <div className='p-4'>{children}</div>
        </div>
        <div className='flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-github-btn-bg text-github-fg-default rounded hover:bg-github-btn-hover'
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Add Farcaster sharing logic here
              onClose()
            }}
            className='px-4 py-2 bg-accent-emphasis text-github-fg-onEmphasis rounded hover:bg-accent-fg'
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default FarcasterProfileModal

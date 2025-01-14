'use client'

import React from 'react'
import { IconChevronDown, IconX, IconInfo } from '@/app/api/icons'

interface RecipeSessionWarningProps {
  isExpanded: boolean
  isVisible: boolean
  showPopover: boolean
  onExpandChange: (expanded: boolean) => void
  onVisibilityChange: (visible: boolean) => void
  onPopoverChange: (show: boolean) => void
}

export const RecipeSessionWarning: React.FC<RecipeSessionWarningProps> = ({
  isExpanded,
  isVisible,
  showPopover,
  onExpandChange,
  onVisibilityChange,
  onPopoverChange,
}) => {
  if (!isVisible) return null

  return (
    <div className='relative max-w-sm mx-auto p-2 bg-github-attention-subtle border border-github-attention-muted rounded-md text-center animate-fade-in md:max-w-3xl md:flex md:items-center md:justify-center'>
      {isExpanded ? (
        <div className='md:flex-1 md:text-center'>
          <h2 className='text-xs md:text-base font-semibold text-github-attention-fg flex justify-between items-center w-full'>
            <span className='flex-1 text-center'>Recipe Creation Notice</span>
            <button onClick={() => onExpandChange(false)} className='ml-2 flex-shrink-0'>
              <IconChevronDown className='w-4 h-4 text-github-attention-fg' />
            </button>
          </h2>
          <p className='text-xs md:text-sm text-github-fg-muted mt-1 md:mt-0'>
            Your recipe data is stored locally until you complete the creation process. To ensure
            your recipe is saved permanently, please complete all required fields and mint your
            recipe NFT. This will store your information on IPFS and create your unique recipe.
          </p>
          <button
            onClick={() => onPopoverChange(!showPopover)}
            className='text-github-accent-emphasis mt-2 md:mt-0 inline-block md:ml-4'
          >
            Learn More
          </button>
          {showPopover && (
            <div className='absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border-4 border-github-accent-emphasis rounded-md shadow-lg p-6 z-[1000] max-w-lg w-full md:w-auto'>
              <div className='flex items-center mb-4'>
                <IconInfo className='w-5 h-5 text-github-attention-fg mr-2' />
                <h3 className='text-lg font-semibold text-github-fg-default'>
                  About Recipe Profiles
                </h3>
              </div>
              <p className='text-sm text-gray-700 mb-4'>
                Your recipe profile is a unique digital identity stored on the blockchain. We use
                IPFS for decentralized storage of your recipe data and Base for secure, efficient
                blockchain transactions. Complete your recipe carefully as some information cannot
                be changed after minting.
              </p>
              <div className='flex justify-between'>
                <a
                  href='https://ipfs.io'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500'
                >
                  Learn about IPFS
                </a>
                <a
                  href='https://base.org'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500'
                >
                  Learn about Base
                </a>
              </div>
              <button onClick={() => onPopoverChange(false)} className='text-blue-500 mt-4'>
                Close
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='flex justify-between items-center'>
          <h2 className='text-xs md:text-base font-semibold text-github-attention-fg'>
            Recipe Creation Notice
          </h2>
          <div className='flex items-center'>
            <button onClick={() => onExpandChange(true)} className='ml-2'>
              <IconChevronDown className='w-4 h-4 text-github-attention-fg transform rotate-180' />
            </button>
            <button onClick={() => onVisibilityChange(false)} className='ml-2'>
              <IconX className='w-4 h-4 text-github-attention-fg' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

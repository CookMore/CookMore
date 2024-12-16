import React, { useState } from 'react'
import { IconChevronDown, IconX, IconInfo } from '@/components/ui/icons'

export const SessionWarning: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [showPopover, setShowPopover] = useState(false)

  if (!isVisible) return null

  return (
    <div className='relative max-w-sm mx-auto my-2 p-2 bg-github-attention-subtle border border-github-attention-muted rounded-md text-center animate-fade-in md:max-w-3xl md:flex md:items-center md:justify-center'>
      {isExpanded ? (
        <div className='md:flex-1 md:text-center'>
          <h2 className='text-xs md:text-base font-semibold text-github-attention-fg flex justify-between items-center'>
            Important Notice
            <button onClick={() => setIsExpanded(false)} className='ml-2'>
              <IconChevronDown className='w-4 h-4 text-github-attention-fg' />
            </button>
          </h2>
          <p className='text-xs md:text-sm text-github-fg-muted mt-1 md:mt-0'>
            Your session data is stored locally and will be lost if you close the browser or refresh
            the page. To ensure your recipe is saved permanently, please complete the minting
            process. This will store your recipe on IPFS and mint it as an NFT.
          </p>
          <button
            onClick={() => setShowPopover(!showPopover)}
            className='text-github-accent-emphasis mt-2 md:mt-0 inline-block md:ml-4'
          >
            Learn More
          </button>
          {showPopover && (
            <div className='absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white border-4 border-github-accent-emphasis rounded-md shadow-lg p-6 z-[1000] max-w-lg w-full md:w-auto'>
              <div className='flex items-center mb-4'>
                <IconInfo className='w-5 h-5 text-github-attention-fg mr-2' />
                <h3 className='text-lg font-semibold text-github-fg-default'>More Information</h3>
              </div>
              <p className='text-sm text-gray-700 mb-4'>
                Our system uses IPFS for decentralized storage and Base, an L2 of Ethereum, for
                efficient and scalable transactions. Ensure you save your work to avoid data loss.
              </p>
              <img
                src='/placeholder-infographic.png'
                alt='Infographic'
                className='w-full h-32 mb-4'
              />
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
              <button onClick={() => setShowPopover(false)} className='text-blue-500 mt-4'>
                Close
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='flex justify-between items-center'>
          <h2 className='text-xs md:text-base font-semibold text-github-attention-fg'>
            Important Notice
          </h2>
          <div className='flex items-center'>
            <button onClick={() => setIsExpanded(true)} className='ml-2'>
              <IconChevronDown className='w-4 h-4 text-github-attention-fg transform rotate-180' />
            </button>
            <button onClick={() => setIsVisible(false)} className='ml-2'>
              <IconX className='w-4 h-4 text-github-attention-fg' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

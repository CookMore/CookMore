'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { GiftTierModalProps } from '../types/tier-actions'
import { Button } from '@/app/api/components/ui/button'
import { Input } from '@/app/api/components/ui/input'
import { IconGift } from '@/app/api/icons'

export function GiftTierModal({ isOpen, onClose, targetTier, onGiftSuccess }: GiftTierModalProps) {
  const [recipientAddress, setRecipientAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGift = async () => {
    try {
      setIsLoading(true)
      // Gift logic here
      onGiftSuccess?.()
      onClose()
    } catch (error) {
      console.error('Gift failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-lg bg-github-canvas-default p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-github-fg-default'
                >
                  Gift {targetTier} Tier NFT
                </Dialog.Title>
                <div className='mt-4'>
                  <Input
                    placeholder="Recipient's wallet address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className='w-full'
                  />
                </div>

                <div className='mt-6 flex justify-end space-x-4'>
                  <Button variant='outline' onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGift}
                    disabled={!recipientAddress || isLoading}
                    className='gap-2'
                  >
                    <IconGift className='h-4 w-4' />
                    Gift NFT
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

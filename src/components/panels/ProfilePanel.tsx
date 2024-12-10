'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { usePrivy } from '@privy-io/react-auth'
import { IconUser, IconEdit } from '@/components/ui/icons'
import { BasePanel } from './BasePanel'
import Image from 'next/image'
import { ProfileTier } from '@/types/profile'
import { TierBadge } from '@/components/ui/TierBadge'
import { useNFTTiers } from '@/lib/web3/hooks/useNFTTiers'

const PRO_IMAGE_URL = 'https://ipfs.io/ipfs/QmQnkRY6b2ckAbYQtn7btBWw3p2LcL2tZReFxViJ3aayk3'
const GROUP_IMAGE_URL = 'https://ipfs.io/ipfs/QmRNqHVG9VHBafsd9ypQt82rZwVMd14Qt2DWXiK5dptJRs'

// Contract addresses
const PRO_CONTRACT = '0xa859Ca4cF5Fc201E710C1A8Dc8540beaa9878C02'
const GROUP_CONTRACT = '0x6c927C8F1661460c5f3adDcd26d7698910077492'

// Simplified ABI for balance checking
const NFT_ABI = ['function balanceOf(address owner) view returns (uint256)']

export function ProfilePanel() {
  const { user, authenticated, ready } = usePrivy()
  const { hasGroup, hasPro } = useNFTTiers()
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  useEffect(() => {
    checkUserTier()
  }, [authenticated, ready])

  const checkUserTier = async () => {
    if (!authenticated || !ready || !window.ethereum) {
      setTier(ProfileTier.FREE)
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      const proContract = new ethers.Contract(PRO_CONTRACT, NFT_ABI, provider)
      const groupContract = new ethers.Contract(GROUP_CONTRACT, NFT_ABI, provider)

      const proBalance = await proContract.balanceOf(address)
      const groupBalance = await groupContract.balanceOf(address)

      if (groupBalance > 0) {
        setTier(ProfileTier.GROUP)
      } else if (proBalance > 0) {
        setTier(ProfileTier.PRO)
      } else {
        setTier(ProfileTier.FREE)
      }
    } catch (error) {
      console.error('Error checking NFT balance:', error)
      setTier(ProfileTier.FREE)
    }
  }

  return (
    <BasePanel title='Profile'>
      <div className='space-y-6'>
        {/* Avatar Section */}
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 rounded-full bg-github-canvas-default border border-github-border-default flex items-center justify-center'>
            {user?.avatar ? (
              <img src={user.avatar} alt='Profile' className='w-full h-full rounded-full' />
            ) : (
              <IconUser className='w-8 h-8 text-github-fg-muted' />
            )}
          </div>
          <button className='text-sm text-github-accent-fg hover:text-github-accent-emphasis'>
            <IconEdit className='w-4 h-4 inline mr-1' />
            Change avatar
          </button>
        </div>

        {/* Tier Section */}
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-github-fg-default'>Membership Tier</h3>
          <div className='flex items-center space-x-3'>
            <TierBadge tier={currentTier} size='md' hasProfile={true} />
          </div>
        </div>

        {/* Profile Info */}
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-1'>
              Display Name
            </label>
            <input
              type='text'
              defaultValue={user?.displayName || ''}
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-github-fg-default mb-1'>Bio</label>
            <textarea
              className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md text-github-fg-default'
              rows={3}
            />
          </div>
        </div>
      </div>
    </BasePanel>
  )
}

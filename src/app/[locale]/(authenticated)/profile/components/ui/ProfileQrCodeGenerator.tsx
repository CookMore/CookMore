import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Profile } from '../../profile'
import { IconCopy } from '@/app/api/icons'
import { FaTwitter, FaFacebook } from 'react-icons/fa'
import FarcasterProfileModal from './FarcasterProfileModal'

interface ProfileQrCodeGeneratorProps {
  profileData: Profile
}

const ProfileQrCodeGenerator: React.FC<ProfileQrCodeGeneratorProps> = ({ profileData }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const modalQrCodeRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 400,
      height: 400,
      data: `https://example.com/profile/${profileData.tokenId}`,
      dotsOptions: {
        color: '#000',
        type: 'rounded',
      },
      cornersSquareOptions: {
        color: '#000',
        type: 'extra-rounded',
      },
      backgroundOptions: {
        color: '#fff',
      },
    })

    if (qrCodeRef.current) {
      qrCodeRef.current.innerHTML = ''
      qrCode.append(qrCodeRef.current)
    }

    if (modalQrCodeRef.current) {
      modalQrCodeRef.current.innerHTML = ''
      qrCode.append(modalQrCodeRef.current)
    }
  }, [profileData, isModalOpen])

  const handleCopy = () => {
    const url = `https://example.com/profile/${profileData.tokenId}`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('Profile URL copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  const shareOnX = () => {
    const url = `https://example.com/profile/${profileData.tokenId}`
    const text = encodeURIComponent('Check out this profile!')
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      '_blank'
    )
  }

  const shareOnMeta = () => {
    const url = `https://example.com/profile/${profileData.tokenId}`
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  const openFarcasterModal = () => {
    setIsModalOpen(true)
  }

  return (
    <div
      className='qr-code-container border border-gray-300 p-10 rounded-md relative flex flex-col items-center justify-center'
      style={{ width: '500px', height: '600px', padding: '50px' }}
    >
      <div ref={qrCodeRef} className='mb-4'></div>
      <div className='flex space-x-4'>
        <button
          onClick={handleCopy}
          className='text-gray-500 hover:text-gray-700 flex items-center justify-center w-10 h-10 rounded-full bg-github-canvas-overlay hover:bg-github-btn-hover transition-all'
        >
          <IconCopy className='h-6 w-6' />
        </button>
        <button
          onClick={shareOnX}
          className='text-gray-500 hover:text-gray-700 flex items-center justify-center w-10 h-10 rounded-full bg-github-canvas-overlay hover:bg-github-btn-hover transition-all'
        >
          <FaTwitter className='h-6 w-6' />
        </button>
        <button
          onClick={shareOnMeta}
          className='text-gray-500 hover:text-gray-700 flex items-center justify-center w-10 h-10 rounded-full bg-github-canvas-overlay hover:bg-github-btn-hover transition-all'
        >
          <FaFacebook className='h-6 w-6' />
        </button>
        <button
          onClick={openFarcasterModal}
          className='text-gray-500 hover:text-gray-700 flex items-center justify-center w-10 h-10 rounded-full bg-github-canvas-overlay hover:bg-github-btn-hover transition-all'
        >
          <img src='/icons/brand/farcaster-white-black.svg' alt='Farcaster' className='h-6 w-6' />
        </button>
      </div>

      <FarcasterProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div ref={modalQrCodeRef} className='qr-code-container'></div>
      </FarcasterProfileModal>
    </div>
  )
}

export default ProfileQrCodeGenerator

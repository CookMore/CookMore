import React, { useState } from 'react'
import { ethers } from 'ethers'
import { createApplicantAttestation } from '../attestation/createApplicantAttestation'
import { uploadEncryptedDataToIPFS } from '../services/ipfs/jobs.ipfs.service'
import { toast } from 'sonner'
import { IconLock, IconX } from '@tabler/icons-react'
import CryptoJS from 'crypto-js'

const EmployeeApplication: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', privateField: '', resume: null })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, resume: event.target.files[0] })
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (!window.ethereum) {
        alert('Please install a Web3 wallet (e.g., MetaMask).')
        return
      }

      setIsLoading(true)
      setMessage('Connecting to wallet...')

      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const walletAddress = await signer.getAddress()

      // Upload resume to IPFS if provided
      let resumeCID = ''
      if (formData.resume) {
        const resumeData = new FormData()
        resumeData.append('file', formData.resume)
        resumeCID = await uploadResumeToIPFS(resumeData)
        console.log('📄 Resume uploaded to IPFS:', resumeCID)
      }

      const encryptedData = {
        privateField: formData.privateField,
        status: 'pending',
      }
      const encryptedCid = await uploadEncryptedDataToIPFS(encryptedData)
      console.log('🔐 Data uploaded to IPFS:', encryptedCid)

      await createApplicantAttestation(walletAddress, formData.name, resumeCID, signer)

      setMessage('✅ Application submitted successfully!')
    } catch (error) {
      console.error('❌ Application submission failed:', error)
      toast.error('Submission failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='p-4 border rounded relative'>
      <button onClick={onClose} className='absolute top-2 right-2 bg-gray-200 rounded-full p-1'>
        <IconX className='text-gray-600' />
      </button>
      <h3 className='font-bold mb-2'>Apply as Employee</h3>
      <form onSubmit={handleSubmit}>
        <div className='relative mb-2'>
          <input
            className='border p-1 w-full pr-10 hover:border-blue-500 focus:border-blue-500'
            type='text'
            placeholder='Name'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className='relative mb-2'>
          <input
            className='border p-1 w-full pr-10 hover:border-blue-500 focus:border-blue-500'
            type='email'
            placeholder='Email (Encrypted)'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <IconLock className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500' />
        </div>
        <div className='relative mb-2'>
          <input
            className='border p-1 w-full pr-10 hover:border-blue-500 focus:border-blue-500'
            type='text'
            placeholder='Private Field (Encrypted)'
            value={formData.privateField}
            onChange={(e) => setFormData({ ...formData, privateField: e.target.value })}
          />
          <IconLock className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500' />
        </div>
        <div className='relative mb-2'>
          <input
            type='file'
            onChange={handleFileChange}
            className='border p-1 w-full hover:border-blue-500 focus:border-blue-500'
          />
          <p className='text-sm text-gray-500 mt-1'>
            Upload your resume (optional). Note: The resume will be stored publicly on IPFS.
          </p>
        </div>
        <button
          type='submit'
          className={`bg-blue-500 text-white px-4 py-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Submit Application'}
        </button>
      </form>
      {message && <p className='mt-2'>{message}</p>}
    </div>
  )
}

export default EmployeeApplication

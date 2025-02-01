import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { createEmployerApplicationWithRoleCheck } from '../attestation/createEmployerApplicationWithRoleCheck'
import { uploadEncryptedDataToIPFS } from '../services/ipfs/jobs.ipfs.service'
import { toast } from 'sonner'
import { IconLock, IconX } from '@tabler/icons-react'

const EmployerApplication: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    companyAddress: '',
    industry: '',
    numberOfEmployees: '',
    privateField: '',
    additionalInfo: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.ethereum) {
      toast.error('Web3 wallet not found. Please install MetaMask or another Web3 wallet.')
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        alert('Please install a Web3 wallet (e.g., MetaMask).')
        return
      }

      setIsLoading(true)
      setMessage('Connecting to wallet...')

      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const walletAddress = await signer.getAddress()

      const encryptedData = {
        email: formData.email,
        companyAddress: formData.companyAddress,
        industry: formData.industry,
        numberOfEmployees: formData.numberOfEmployees,
        privateField: formData.privateField,
        additionalInfo: formData.additionalInfo,
        status: 'pending',
      }
      const encryptedCid = await uploadEncryptedDataToIPFS(encryptedData)
      console.log('🔐 Data uploaded to IPFS:', encryptedCid)

      await createEmployerApplicationWithRoleCheck(
        walletAddress,
        formData.companyName,
        encryptedCid,
        signer
      )

      setMessage('✅ Application submitted successfully!')
    } catch (error) {
      console.error('Error during submission:', error)
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
      <h3 className='font-bold mb-2'>Apply as Employer</h3>
      <form onSubmit={handleSubmit}>
        <div className='relative mb-2'>
          <input
            className='border p-1 w-full pr-10 hover:border-blue-500 focus:border-blue-500'
            type='text'
            placeholder='Company Name'
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
            placeholder='Company Address (Encrypted)'
            value={formData.companyAddress}
            onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
          />
          <IconLock className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500' />
        </div>
        <div className='relative mb-2'>
          <input
            className='border p-1 w-full pr-10 hover:border-blue-500 focus:border-blue-500'
            type='text'
            placeholder='Industry (Encrypted)'
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
          <IconLock className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500' />
        </div>
        <div className='relative mb-2'>
          <input
            className='border p-1 w-full pr-10 hover:border-blue-500 focus:border-blue-500'
            type='text'
            placeholder='Number of Employees (Encrypted)'
            value={formData.numberOfEmployees}
            onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
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
            className='border p-1 w-full pr-10 hover:border-blue-500 focus:border-blue-500'
            type='text'
            placeholder='Additional Info (Encrypted)'
            value={formData.additionalInfo}
            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
          />
          <IconLock className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500' />
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

export default EmployerApplication

import React, { useState } from 'react'
import { ethers } from 'ethers'
import { createEmployerApplicationWithRoleCheck } from '../attestation/createEmployerApplicationWithRoleCheck'

const EmployerApplication: React.FC = () => {
  const [companyName, setCompanyName] = useState('')
  const [docsCid, setDocsCid] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
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

      await createEmployerApplicationWithRoleCheck(signer, walletAddress, companyName, docsCid)

      setMessage('✅ Employer verification request submitted!')
    } catch (err) {
      console.error(err)
      setMessage('❌ Error submitting request.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='p-4 border rounded'>
      <h3 className='font-bold mb-2'>Become a Verified Employer</h3>
      <input
        className='border p-1 w-full mb-2'
        type='text'
        placeholder='Company Name'
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <input
        className='border p-1 w-full mb-2'
        type='text'
        placeholder='Docs CID (optional)'
        value={docsCid}
        onChange={(e) => setDocsCid(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className={`bg-blue-600 text-white px-4 py-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Submit Employer Request'}
      </button>
      {message && <p className='mt-2'>{message}</p>}
    </div>
  )
}

export default EmployerApplication

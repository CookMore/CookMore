import React, { useState } from 'react'
import { ethers } from 'ethers'
import { createApplicantAttestation } from '../attestation/createApplicantAttestation'

const EmployeeApplication: React.FC = () => {
  const [name, setName] = useState('')
  const [resumeCid, setResumeCid] = useState('')
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

      await createApplicantAttestation(signer, walletAddress, name, resumeCid)

      setMessage('✅ Application submitted successfully!')
    } catch (err) {
      console.error(err)
      setMessage('❌ Error submitting application.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='p-4 border rounded'>
      <h3 className='font-bold mb-2'>Apply as Applicant</h3>
      <input
        className='border p-1 w-full mb-2'
        type='text'
        placeholder='Your Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className='border p-1 w-full mb-2'
        type='text'
        placeholder='Resume CID (optional)'
        value={resumeCid}
        onChange={(e) => setResumeCid(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className={`bg-green-500 text-white px-4 py-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Submit Application'}
      </button>
      {message && <p className='mt-2'>{message}</p>}
    </div>
  )
}

export default EmployeeApplication

import React, { useState } from 'react'
import { useJobs } from '../context/JobsContext'
import { createApplicantAttestation } from '../attestation/createApplicantAttestation'
import { createEmployerApplicationWithRoleCheck } from '../attestation/createEmployerApplicationWithRoleCheck'
import { createJobAttestation } from '../attestation/createJobAttestation'
import { payForJob } from '../services/server/payForJob'
import { JOB_TIERS } from '../constants/tiers.constants'
import { ethers } from 'ethers'

const AdminAttestationCreator: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [attestationType, setAttestationType] = useState<'employer' | 'applicant'>('employer')
  const [companyName, setCompanyName] = useState('')
  const [applicantName, setApplicantName] = useState('')
  const [status, setStatus] = useState('')

  async function handleCreateAttestation() {
    try {
      setStatus('Creating attestation...')
      if (attestationType === 'applicant') {
        await createApplicantAttestation(walletAddress, applicantName)
      } else {
        await createEmployerApplicationWithRoleCheck(walletAddress, companyName)
      }
      setStatus('Attestation created!')
    } catch (err) {
      console.error(err)
      setStatus('Error creating attestation.')
    }
  }

  return (
    <div className='p-4 border rounded'>
      <h3 className='font-bold mb-2'>Admin Attestation Creator</h3>
      <select
        value={attestationType}
        onChange={(e) => setAttestationType(e.target.value as any)}
        className='mb-2 border p-1'
      >
        <option value='employer'>Employer</option>
        <option value='applicant'>Applicant</option>
      </select>
      <div className='mb-2'>
        <label>Wallet Address:</label>
        <input
          type='text'
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className='border p-1 w-full'
        />
      </div>
      {attestationType === 'employer' && (
        <div className='mb-2'>
          <label>Company Name:</label>
          <input
            type='text'
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className='border p-1 w-full'
          />
        </div>
      )}
      {attestationType === 'applicant' && (
        <div className='mb-2'>
          <label>Applicant Name:</label>
          <input
            type='text'
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            className='border p-1 w-full'
          />
        </div>
      )}
      <button onClick={handleCreateAttestation} className='bg-blue-500 text-white px-4 py-2'>
        Create Attestation
      </button>
      {status && <p className='mt-2'>{status}</p>}
    </div>
  )
}

export default AdminAttestationCreator

'use client'

import React, { useState } from 'react'

/**
 * AttestationManager: Admin UI for EAS attestation management.
 * - Admin can create an applicant or employer attestation for a given wallet.
 * - Admin can revoke an attestation by UID.
 *
 * Adjust the fetch calls (`/api/attestation/create` / `/api/attestation/revoke`)
 * to match your actual backend or script approach.
 */

const AttestationManager: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [attestationType, setAttestationType] = useState<'applicant' | 'employer'>('applicant')
  const [resumeCid, setResumeCid] = useState('') // For applicant
  const [companyName, setCompanyName] = useState('') // For employer
  const [docsCid, setDocsCid] = useState('') // For employer
  const [revokeUID, setRevokeUID] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [pendingApplications, setPendingApplications] = useState([])

  const handleCreateAttestation = async () => {
    try {
      setStatusMessage('Creating attestation...')
      // Example: Call an API route.
      // In real usage, you might call your Node script or a Next.js route like /api/attestation/create
      const payload = {
        wallet: walletAddress,
        type: attestationType,
        resumeCid,
        companyName,
        docsCid,
      }
      const res = await fetch('/api/attestation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`)
      }
      const data = await res.json()
      setStatusMessage(`Attestation created! UID: ${data.uid}`)
    } catch (err: any) {
      console.error('Failed to create attestation:', err)
      setStatusMessage(`Error: ${err.message}`)
    }
  }

  const handleRevokeAttestation = async () => {
    try {
      setStatusMessage('Revoking attestation...')
      // Example call to /api/attestation/revoke
      const res = await fetch('/api/attestation/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: revokeUID }),
      })
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`)
      }
      const data = await res.json()
      setStatusMessage(`Attestation revoked. TX Hash: ${data.txHash}`)
    } catch (err: any) {
      console.error('Failed to revoke attestation:', err)
      setStatusMessage(`Error: ${err.message}`)
    }
  }

  const fetchPendingApplications = async () => {
    const res = await fetch('/api/applications/pending')
    const data = await res.json()
    setPendingApplications(data)
  }

  const handleApproveApplication = async (applicationId: string) => {
    const res = await fetch(`/api/applications/approve/${applicationId}`, { method: 'POST' })
    if (res.ok) {
      setStatusMessage('Application approved!')
      fetchPendingApplications() // Refresh the list
    } else {
      setStatusMessage('Failed to approve application.')
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h4 className='font-bold mb-2'>Create Attestation</h4>
        <label className='block mb-1'>
          <span className='text-sm text-gray-700'>Wallet Address</span>
          <input
            type='text'
            className='border p-2 w-full'
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </label>

        <label className='block mb-1'>
          <span className='text-sm text-gray-700'>Attestation Type</span>
          <select
            className='border p-2 w-full'
            value={attestationType}
            onChange={(e) => setAttestationType(e.target.value as any)}
          >
            <option value='applicant'>Applicant</option>
            <option value='employer'>Employer</option>
          </select>
        </label>

        {/* Show fields relevant to the chosen type */}
        {attestationType === 'applicant' && (
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block mb-1'>
                <span className='text-sm text-gray-700'>Resume CID (optional)</span>
                <input
                  type='text'
                  className='border p-2 w-full'
                  value={resumeCid}
                  onChange={(e) => setResumeCid(e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {attestationType === 'employer' && (
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block mb-1'>
                <span className='text-sm text-gray-700'>Company Name</span>
                <input
                  type='text'
                  className='border p-2 w-full'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label className='block mb-1'>
                <span className='text-sm text-gray-700'>Docs CID (optional)</span>
                <input
                  type='text'
                  className='border p-2 w-full'
                  value={docsCid}
                  onChange={(e) => setDocsCid(e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        <button
          onClick={handleCreateAttestation}
          className='mt-2 bg-blue-500 text-white px-4 py-2 rounded'
        >
          Create Attestation
        </button>
      </div>

      <hr />

      <div>
        <h4 className='font-bold mb-2'>Revoke Attestation</h4>
        <label className='block mb-1'>
          <span className='text-sm text-gray-700'>Attestation UID</span>
          <input
            type='text'
            className='border p-2 w-full'
            value={revokeUID}
            onChange={(e) => setRevokeUID(e.target.value)}
          />
        </label>
        <button
          onClick={handleRevokeAttestation}
          className='mt-2 bg-red-500 text-white px-4 py-2 rounded'
        >
          Revoke
        </button>
      </div>

      {statusMessage && (
        <div className='mt-3 p-2 border border-gray-300 rounded bg-gray-50'>{statusMessage}</div>
      )}

      <div>
        <h4 className='font-bold mb-2'>Pending Applications</h4>
        {pendingApplications.map((app) => (
          <div key={app.id} className='border p-2 mb-2'>
            <p>Company: {app.companyName}</p>
            <p>Status: {app.status}</p>
            <button
              onClick={() => handleApproveApplication(app.id)}
              className='bg-green-500 text-white px-4 py-2'
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AttestationManager

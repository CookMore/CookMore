'use client'

import React, { useState } from 'react'
import { useJobs } from '../context/JobsContext'
import { JOB_TIERS } from '../constants/tiers.constants'
import { useAccount } from 'wagmi'
import { createJobAttestation } from '../attestation/createJobAttestation'
import { uploadToPinata } from '../services/server/jobs.service'
import { Job } from '../context/JobsContext'
import { useSigner } from '../hooks/useProvider' // Assuming this is where the hooks are located
import { toast } from 'sonner'

interface JobBuilderProps {
  job: Job | null
  addJob: (job: Job) => Promise<void>
  updateJob: (job: Job) => Promise<void>
  onClose: () => void
}

const JobBuilder: React.FC<JobBuilderProps> = ({ job, addJob, updateJob, onClose }) => {
  const { address, isConnected } = useAccount()
  const signer = useSigner() // Use the custom hook for signer
  const { addJob: useJobsAddJob } = useJobs()

  const [title, setTitle] = useState(job?.title || '')
  const [description, setDescription] = useState(job?.description || '')
  const [location, setLocation] = useState(job?.location || '')
  const [requiredSkills, setRequiredSkills] = useState(job?.requiredSkills || '')
  const [tierKey, setTierKey] = useState<'3-months' | '6-months' | '1-year'>('3-months')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!isConnected || !signer) {
      setError('Please connect your wallet first.')
      return
    }

    if (!title || !description || !location || !requiredSkills) {
      setError('All fields are required.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 1️⃣ **Encrypt & Upload Data to IPFS**
      const encryptedData = {
        title,
        description,
        location,
        requiredSkills,
      }

      const encryptedCid = await uploadToPinata(encryptedData)
      console.log('🔐 Data uploaded to IPFS:', encryptedCid)

      // 2️⃣ **Create Attestation**
      const jobData = { title, description, location, requiredSkills, tierKey, employer: address }
      const attestationUID = await createJobAttestation(signer, jobData, encryptedCid)

      console.log('✅ Job attestation created:', attestationUID)

      // 3️⃣ **Store job locally in IndexedDB**
      const newJob = {
        id: job ? job.id : Date.now(),
        title,
        description,
        attestationUID,
        createdAt: job ? job.createdAt : Date.now(),
      }

      if (job) {
        await updateJob(newJob)
      } else {
        await useJobsAddJob(newJob)
      }

      toast.success(`🎉 Job ${job ? 'updated' : 'created'} successfully!`)
      onClose()
    } catch (err) {
      console.error('❌ Job save failed:', err)
      toast.error('Failed to save job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 border rounded bg-white shadow-md'>
      <h3 className='font-bold mb-2'>{job ? 'Edit Job' : 'Create a New Job'}</h3>

      <div className='mb-2'>
        <label>Title:</label>
        <input
          type='text'
          className='border p-1 w-full'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className='mb-2'>
        <label>Description:</label>
        <textarea
          className='border p-1 w-full'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className='mb-2'>
        <label>Location:</label>
        <input
          type='text'
          className='border p-1 w-full'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className='mb-2'>
        <label>Required Skills:</label>
        <input
          type='text'
          className='border p-1 w-full'
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
        />
      </div>

      <div className='mb-2'>
        <label>Choose Duration/Tier:</label>
        <select
          className='border p-1 w-full'
          value={tierKey}
          onChange={(e) => setTierKey(e.target.value as any)}
        >
          <option value='3-months'>3 Months ($10)</option>
          <option value='6-months'>6 Months ($20)</option>
          <option value='1-year'>1 Year ($30)</option>
        </select>
      </div>

      {error && <p className='text-red-500'>{error}</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        className='bg-blue-500 text-white px-4 py-2 mt-2'
      >
        {loading ? 'Processing...' : 'Save & Publish'}
      </button>
    </div>
  )
}

export default JobBuilder

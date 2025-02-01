'use client'

import React, { useState, useEffect } from 'react'
import { useJobs } from '../context/JobsContext'
import { JOB_TIERS } from '../constants/tiers.constants'
import { useAccount } from 'wagmi'
import { uploadEncryptedDataToIPFS } from '../services/ipfs/jobs.ipfs.service'
import { Job } from '../context/JobsContext'
import { toast } from 'sonner'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import { ethers } from 'ethers'
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'
import { usdcABI } from '@/app/api/blockchain/abis/usdc'
import { validateJobData } from '../validations/validateJobs'

const EAS_CONTRACT = '0x4200000000000000000000000000000000000021'
const JOB_SCHEMA_UID = process.env.JOB_SCHEMA_UID || ''
const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897'
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || '0x1920F5b512634DE346100b025382c04eEA8Bbc67'
const USDC_DECIMALS = 6

interface JobBuilderProps {
  job: Job | null
  addJob: (job: Job) => Promise<void>
  updateJob: (job: Job) => Promise<void>
  onClose: () => void
}

// Define a type for the keys of JOB_TIERS
type JobDurationKey = keyof typeof JOB_TIERS

const JobBuilder: React.FC<JobBuilderProps> = ({ job, addJob, updateJob, onClose }) => {
  const { theme } = useTheme()
  const { address, isConnected } = useAccount()
  const { addJob: useJobsAddJob, jobs } = useJobs()

  const [formData, setFormData] = useState<{
    jobName: string
    jobTitle: string
    startDate: number
    referencesCheckRequired: boolean
    isPartTime: boolean
    isOneTime: boolean
    jobDuration: JobDurationKey
    location: string
    requiredSkills: string[]
    requiredExperience: string[]
    credentials: string[]
    encryptedPrivateFieldsCID: string
    employerName: string
    compensation: string
    contactInfo: string
  }>({
    jobName: job?.title || '',
    jobTitle: job?.description || '',
    startDate: Math.floor(Date.now() / 1000),
    referencesCheckRequired: false,
    isPartTime: false,
    isOneTime: false,
    jobDuration: '3-months', // Default to 3-months
    location: job?.location || '',
    requiredSkills: Array.isArray(job?.requiredSkills) ? job.requiredSkills : ['None'],
    requiredExperience: ['None'],
    credentials: ['None'],
    encryptedPrivateFieldsCID: '',
    employerName: '',
    compensation: '',
    contactInfo: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Fetch jobs created by the employer
    // This is a placeholder for fetching logic
    console.log('Fetching jobs for employer:', address)
  }, [address])

  const handleAddEntry = (field: 'requiredSkills' | 'requiredExperience' | 'credentials') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] })
  }

  const handleEntryChange = (
    field: 'requiredSkills' | 'requiredExperience' | 'credentials',
    index: number,
    value: string
  ) => {
    const updatedEntries = [...formData[field]]
    updatedEntries[index] = value
    setFormData({ ...formData, [field]: updatedEntries })
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      validateJobData(formData) // Validate job data

      if (!window.ethereum) {
        alert('Please install a Web3 wallet (e.g., MetaMask).')
        return
      }

      setIsLoading(true)
      setMessage('Connecting to wallet...')

      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()

      const eas = new EAS(EAS_CONTRACT)
      eas.connect(signer)

      const encryptedData = {
        employerName: formData.employerName,
        compensation: formData.compensation,
        contactInfo: formData.contactInfo,
      }
      const encryptedCid = await uploadEncryptedDataToIPFS(encryptedData)
      console.log('🔐 Data uploaded to IPFS:', encryptedCid)

      const tier = JOB_TIERS[formData.jobDuration]
      const expirationTime = BigInt(Date.now() / 1000 + tier.durationDays * 24 * 60 * 60)

      if (!JOB_SCHEMA_UID) throw new Error('Missing JOB_SCHEMA_UID in .env')
      const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcABI, signer)
      const amountInTokens = ethers.parseUnits(tier.priceUSD.toString(), USDC_DECIMALS)
      console.log(
        `Charging $${tier.priceUSD} USDC from employer for the ${formData.jobDuration} job listing...`
      )
      const paymentTx = await usdcContract.transfer(ADMIN_ADDRESS, amountInTokens)
      const paymentReceipt = await paymentTx.wait()
      console.log('✅ Payment confirmed. Tx hash:', paymentReceipt.transactionHash)

      const schemaEncoder = new SchemaEncoder(`
        string jobName,
        string jobTitle,
        uint64 startDate,
        bool referencesCheckRequired,
        bool isPartTime,
        bool isOneTime,
        string jobDuration,
        string location,
        string requiredSkills,
        string requiredExperience,
        string credentials,
        string encryptedPrivateFieldsCID
      `)

      const encodedData = schemaEncoder.encodeData([
        { name: 'jobName', value: formData.jobName, type: 'string' },
        { name: 'jobTitle', value: formData.jobTitle, type: 'string' },
        { name: 'startDate', value: formData.startDate, type: 'uint64' },
        { name: 'referencesCheckRequired', value: formData.referencesCheckRequired, type: 'bool' },
        { name: 'isPartTime', value: formData.isPartTime, type: 'bool' },
        { name: 'isOneTime', value: formData.isOneTime, type: 'bool' },
        { name: 'jobDuration', value: formData.jobDuration, type: 'string' },
        { name: 'location', value: formData.location, type: 'string' },
        { name: 'requiredSkills', value: formData.requiredSkills.join(', '), type: 'string' },
        {
          name: 'requiredExperience',
          value: formData.requiredExperience.join(', '),
          type: 'string',
        },
        { name: 'credentials', value: formData.credentials.join(', '), type: 'string' },
        {
          name: 'encryptedPrivateFieldsCID',
          value: formData.encryptedPrivateFieldsCID,
          type: 'string',
        },
      ])

      console.log(`📜 Creating EAS attestation for job posting...`)
      const employerAddress = await signer.getAddress()

      const tx = await eas.attest({
        schema: JOB_SCHEMA_UID,
        data: {
          recipient: employerAddress,
          expirationTime: expirationTime,
          revocable: true,
          data: encodedData,
        },
      })

      const receipt = await tx.wait()
      const logs = JSON.parse(receipt).logs
      console.log('✅ Job Attestation Created! UID:', logs[0].data)

      await useJobsAddJob({
        id: Date.now(),
        title: formData.jobName,
        description: formData.jobTitle,
        location: formData.location,
        requiredSkills: formData.requiredSkills.join(', '),
        tierKey: formData.jobDuration,
        createdAt: formData.startDate,
        attestationUID: logs[0].data,
      })

      setMessage('✅ Job created successfully!')
    } catch (error) {
      console.error('Error during job creation:', error)
      toast.error('Job creation failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevoke = async (jobId: string) => {
    try {
      setIsLoading(true)
      setMessage('Revoking job...')

      console.log('Revoking job attestation for job ID:', jobId)
      // await revokeJobAttestation(signer, jobId)

      setMessage('✅ Job revoked successfully!')
    } catch (error) {
      console.error('Error during job revocation:', error)
      toast.error('Job revocation failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`p-4 border rounded bg-white shadow-md ${theme}`}>
      <h3 className='font-bold mb-2'>{job ? 'Edit Job' : 'Create New Job'}</h3>

      <form onSubmit={handleSave}>
        <div className='mb-2'>
          <label>Title:</label>
          <input
            type='text'
            className='border p-1 w-full'
            value={formData.jobName}
            onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
            required
          />
        </div>

        <div className='mb-2'>
          <label>Description:</label>
          <textarea
            className='border p-1 w-full'
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            required
          />
        </div>

        <div className='mb-2'>
          <label>Location:</label>
          <input
            type='text'
            className='border p-1 w-full'
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className='mb-2'>
          <label>Required Skills:</label>
          {formData.requiredSkills.map((skill, index) => (
            <input
              key={index}
              type='text'
              className='border p-1 w-full mb-1'
              value={skill}
              onChange={(e) => handleEntryChange('requiredSkills', index, e.target.value)}
              required
            />
          ))}
          <button type='button' onClick={() => handleAddEntry('requiredSkills')}>
            Add Skill
          </button>
        </div>

        <div className='mb-2'>
          <label>Required Experience:</label>
          {formData.requiredExperience.map((experience, index) => (
            <input
              key={index}
              type='text'
              className='border p-1 w-full mb-1'
              value={experience}
              onChange={(e) => handleEntryChange('requiredExperience', index, e.target.value)}
              required
            />
          ))}
          <button type='button' onClick={() => handleAddEntry('requiredExperience')}>
            Add Experience
          </button>
        </div>

        <div className='mb-2'>
          <label>Credentials:</label>
          {formData.credentials.map((credential, index) => (
            <input
              key={index}
              type='text'
              className='border p-1 w-full mb-1'
              value={credential}
              onChange={(e) => handleEntryChange('credentials', index, e.target.value)}
              required
            />
          ))}
          <button type='button' onClick={() => handleAddEntry('credentials')}>
            Add Credential
          </button>
        </div>

        <div className='mb-2'>
          <label>Choose Duration Tier:</label>
          <select
            className='border p-1 w-full'
            value={formData.jobDuration}
            onChange={(e) =>
              setFormData({ ...formData, jobDuration: e.target.value as JobDurationKey })
            }
          >
            {Object.entries(JOB_TIERS).map(([key, tier]) => (
              <option key={key} value={key}>
                {tier.label} - ${tier.priceUSD}
              </option>
            ))}
          </select>
        </div>

        {message && <p className='text-red-500'>{message}</p>}

        <button
          type='submit'
          className={`bg-blue-500 text-white px-4 py-2 mt-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Save and Publish'}
        </button>
      </form>

      <h3 className='font-bold mt-4'>Your Jobs</h3>
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className='border p-2 mb-2'>
            <h4>{job.title}</h4>
            <p>{job.description}</p>
            <button
              className='bg-red-500 text-white px-2 py-1'
              onClick={() => handleRevoke(job.id.toString())}
            >
              Revoke
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default JobBuilder

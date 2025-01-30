import React, { useState } from 'react'
import JobBuilder from './JobBuilder'
import EmployerApplication from './EmployerApplication'
import { useJobsQuery } from '../services/server/jobs.service'
import { useVerification } from '../hooks/useVerification'
import { useJobs } from '../context/JobsContext'
import { useAccount } from 'wagmi'
import { Job } from '../context/JobsContext'
import { toast } from 'sonner'

const JobBoard: React.FC = () => {
  const { address: userAddress } = useAccount()
  const { data: jobs, isLoading, error: jobsError } = useJobsQuery()

  const EMPLOYER_SCHEMA_UID = process.env.NEXT_PUBLIC_EMPLOYER_SCHEMA_UID || ''
  const {
    isVerified,
    isLoading: isVerifying,
    error: verifyError,
  } = useVerification(userAddress || '', EMPLOYER_SCHEMA_UID)

  const { addJob, updateJob } = useJobs()
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isEmployerAppOpen, setIsEmployerAppOpen] = useState(false)

  const handleOpenBuilder = (job: Job | null = null) => {
    setSelectedJob(job)
    setIsBuilderOpen(true)
  }

  const handleCloseBuilder = () => {
    setIsBuilderOpen(false)
    setSelectedJob(null)
  }

  const handleOpenEmployerApp = () => {
    setIsEmployerAppOpen(true)
  }

  const handleCloseEmployerApp = () => {
    setIsEmployerAppOpen(false)
  }

  if (isLoading) return <div className='text-gray-500'>Loading jobs...</div>
  if (jobsError) return <div className='text-red-500'>Error loading jobs: {String(jobsError)}</div>

  return (
    <div className='p-4 border rounded'>
      <h3 className='font-bold mb-2'>Job Board</h3>

      {verifyError && <div className='text-red-600 mb-2'>Verification error: {verifyError}</div>}
      {isVerifying && <div className='text-yellow-500 mb-2'>Checking verification...</div>}

      {!isVerified && !isVerifying && (
        <div className='mb-4'>
          <p className='text-red-600'>You must be verified as an employer to post jobs.</p>
          <button
            onClick={handleOpenEmployerApp}
            className='bg-yellow-500 text-white px-4 py-2 mt-2'
          >
            Get Verified
          </button>
        </div>
      )}

      {isVerified && (
        <button
          onClick={() => handleOpenBuilder()}
          className='bg-blue-500 text-white px-4 py-2 mb-4'
        >
          Add New Job
        </button>
      )}

      {jobs?.map((job) => (
        <div key={job.id} className='mb-4 p-4 border rounded'>
          <h4 className='font-bold'>{job.title}</h4>
          <p>{job.description}</p>
          {isVerified && (
            <button
              onClick={() => handleOpenBuilder(job)}
              className='bg-green-500 text-white px-4 py-2 mt-2'
            >
              Edit Job
            </button>
          )}
        </div>
      ))}

      {isBuilderOpen && (
        <JobBuilder
          job={selectedJob}
          addJob={addJob}
          updateJob={updateJob}
          onClose={handleCloseBuilder}
        />
      )}

      {isEmployerAppOpen && <EmployerApplication />}
    </div>
  )
}

export default JobBoard

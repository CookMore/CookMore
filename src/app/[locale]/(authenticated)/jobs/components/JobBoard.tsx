'use client'

import React, { useState, useEffect } from 'react'
import JobBuilder from './JobBuilder'
import EmployerApplication from './EmployerApplication'
import EmployeeApplication from './EmployeeApplication'
import { useJobsQuery } from '../services/server/jobs.service'
import { useVerification } from '../hooks/useVerification'
import { useJobs } from '../context/JobsContext'
import { useAccount } from 'wagmi'
import { Job } from '../context/JobsContext'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'
import { Button } from '@/app/api/components/ui/button'
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'

const JobBoard: React.FC = () => {
  const t = useTranslations('jobs')
  const { theme } = useTheme()
  const { address: userAddress } = useAccount()
  const { data: jobsQuery, isLoading, error: jobsError } = useJobsQuery()
  const { jobs, addJob, updateJob } = useJobs()

  const EMPLOYER_SCHEMA_UID = process.env.NEXT_PUBLIC_EMPLOYER_SCHEMA_UID || ''
  const {
    isVerified,
    isLoading: isVerifying,
    error: verifyError,
  } = useVerification(userAddress || '', EMPLOYER_SCHEMA_UID)

  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isEmployerAppOpen, setIsEmployerAppOpen] = useState(false)
  const [isApplicantAppOpen, setIsApplicantAppOpen] = useState(false)

  // Show a toast only once when there's a verification error
  useEffect(() => {
    if (verifyError) {
      toast.error(`Verification error: ${verifyError}`, { position: 'top-center' })
    }
  }, [verifyError])

  // Show a toast only once when there's an error loading jobs
  useEffect(() => {
    if (jobsError) {
      toast.error(`Error loading jobs: ${String(jobsError)}`, { position: 'top-center' })
    }
  }, [jobsError])

  // Optionally toast once for loading
  useEffect(() => {
    if (isLoading) {
      toast('Loading jobs...', { position: 'top-center' })
    }
  }, [isLoading])

  // Simplify your conditional rendering
  if (isLoading) {
    return <div className='text-github-fg-muted'>Loading jobs...</div>
  }

  if (jobsError) {
    return <div className='text-red-500'>Error loading jobs: {String(jobsError)}</div>
  }

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

  const handleOpenApplicantApp = () => {
    setIsApplicantAppOpen(true)
  }

  const handleCloseApplicantApp = () => {
    setIsApplicantAppOpen(false)
  }

  const handleJobAdded = () => {
    toast.success('Job added successfully!', { position: 'top-center' })
  }

  const handleJobUpdated = () => {
    toast.success('Job updated successfully!', { position: 'top-center' })
  }

  return (
    <div className={`p-4 border rounded ${theme} bg-github-canvas-default text-github-fg-default`}>
      <h1 className='text-2xl font-bold mb-4'>Culinary Job Board</h1>
      <p className='mb-4 text-github-fg-muted'>Explore and manage culinary job opportunities.</p>

      <div className='verification-container mb-6 p-4 border rounded bg-github-canvas-subtle'>
        <h3 className='text-lg font-semibold mb-2'>Verification</h3>
        <p className='text-sm mb-4'>Manage your applications and verifications here.</p>

        <div className='flex gap-4'>
          <Button className='bg-blue-500 text-white px-4 py-2' onClick={handleOpenEmployerApp}>
            Employer Application
          </Button>
          <Button className='bg-green-500 text-white px-4 py-2' onClick={handleOpenApplicantApp}>
            Applicant Application
          </Button>
        </div>
      </div>

      {verifyError && (
        <div className='bg-github-canvas-subtle p-2 rounded mb-2 flex items-center'>
          <IconAlertCircle className='text-red-500 mr-2' />
          <span className='text-sm'>Verification error: {verifyError}</span>
        </div>
      )}

      {isVerifying && (
        <div className='bg-yellow-100 p-2 rounded mb-2 flex items-center'>
          <span className='material-icons text-yellow-500 mr-2'>hourglass_empty</span>
          <span className='text-sm'>Checking verification...</span>
        </div>
      )}

      {!isVerified && !isVerifying && (
        <div className='mb-4'>
          <p className='text-red-600'>You must be verified to create or apply for jobs.</p>
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

      {(jobsQuery || []).map((job) => (
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
          addJob={async (job) => {
            await addJob(job)
            handleJobAdded()
          }}
          updateJob={async (job) => {
            await updateJob(job)
            handleJobUpdated()
          }}
          onClose={handleCloseBuilder}
        />
      )}

      {isEmployerAppOpen && <EmployerApplication onClose={handleCloseEmployerApp} />}
      {isApplicantAppOpen && <EmployeeApplication onClose={handleCloseApplicantApp} />}
    </div>
  )
}

export default JobBoard

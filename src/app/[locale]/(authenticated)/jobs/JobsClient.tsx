import React, { useState } from 'react'
import JobBoard from './components/JobBoard'
import { useJobs } from './context/JobsContext'

const JobsClient: React.FC = () => {
  const { jobs, addJob, updateJob } = useJobs()

  return (
    <div className='mx-auto px-4 py-6'>
      <JobBoard jobs={jobs} addJob={addJob} updateJob={updateJob} />
    </div>
  )
}

export default JobsClient

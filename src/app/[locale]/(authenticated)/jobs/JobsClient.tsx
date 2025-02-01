'use client'

import React from 'react'
import JobBoard from './components/JobBoard'

const JobsClient: React.FC = () => {
  return (
    <div className='mx-auto px-4 py-6 max-w-5xl'>
      <JobBoard />
    </div>
  )
}

export default JobsClient

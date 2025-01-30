import React from 'react'

const JobPreview: React.FC<{ job: any; onEdit?: () => void }> = ({ job, onEdit }) => {
  return (
    <div className='p-4 border rounded mb-4'>
      <h3 className='font-bold'>{job.title}</h3>
      <p>{job.description}</p>
      {onEdit && (
        <button onClick={onEdit} className='bg-green-500 text-white px-4 py-2 mt-2'>
          Edit
        </button>
      )}
    </div>
  )
}

export default JobPreview

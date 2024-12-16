import React from 'react'
import EnterpriseContactForm from './EnterpriseContactForm'

interface EnterprisePopoverProps {
  onClose: () => void
}

const EnterprisePopover: React.FC<EnterprisePopoverProps> = ({ onClose }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
      <div className='bg-github-canvas-default p-6 rounded-lg shadow-lg max-w-md w-full border border-github-border-default hover:border-github-border-muted transition-colors'>
        <h2 className='text-xl font-bold text-github-fg-default mb-4'>Contact Our Sales Team</h2>
        <p className='text-github-fg-muted mb-4'>
          Please fill out the form below, and our team will get back to you shortly.
        </p>
        <EnterpriseContactForm />
        <button onClick={onClose} className='btn btn-secondary w-full mt-4'>
          Close
        </button>
      </div>
    </div>
  )
}

export default EnterprisePopover

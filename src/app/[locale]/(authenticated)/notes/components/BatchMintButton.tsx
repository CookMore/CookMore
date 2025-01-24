import React from 'react'

interface BatchMintButtonProps {
  onBatchMint: () => void
}

const BatchMintButton: React.FC<BatchMintButtonProps> = ({ onBatchMint }) => {
  return (
    <button
      type='button'
      onClick={onBatchMint}
      className='bg-green-500 text-white py-2 px-4 rounded'
    >
      Batch Mint Notes
    </button>
  )
}

export default BatchMintButton

import React from 'react'

interface BurnTokenButtonProps {
  onBurn: (tokenId: number) => void
  tokenId: number
}

const BurnTokenButton: React.FC<BurnTokenButtonProps> = ({ onBurn, tokenId }) => {
  const handleBurn = () => {
    onBurn(tokenId)
  }

  return (
    <button type='button' onClick={handleBurn} className='bg-red-500 text-white py-2 px-4 rounded'>
      Burn Token
    </button>
  )
}

export default BurnTokenButton

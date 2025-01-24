import React from 'react'

interface MintTokenButtonProps {
  onMint: (tokenURI: string) => void
  tokenURI: string
}

const MintTokenButton: React.FC<MintTokenButtonProps> = ({ onMint, tokenURI }) => {
  const handleMint = () => {
    onMint(tokenURI)
  }

  return (
    <button type='button' onClick={handleMint} className='bg-blue-500 text-white py-2 px-4 rounded'>
      Mint Token
    </button>
  )
}

export default MintTokenButton

import { useCallback } from 'react'
// Ethers v6 direct imports:
import { BrowserProvider, Contract } from 'ethers'

import { stickyABI } from '@/app/api/blockchain/abis/sticky'

// Example contract address
const CONTRACT_ADDRESS = '0xA5265C7B7B63f73b6c0Fc0a9034219e4B39372e6'

export const useNotesContract = () => {
  // Ethers v6: "BrowserProvider" for window.ethereum usage
  // This returns a provider that can prompt the user to sign transactions
  const provider = new BrowserProvider(window.ethereum as any)

  // For read/write calls, get the signer
  // Because "useCallback" can’t be synchronous, we do this outside or inline
  // Usually, you'd store the signer in a state or effect if needed
  // but for simplicity, we do it inline.
  const signerFunction = async () => {
    return await provider.getSigner()
  }

  // Initialize the contract - we do so in a function that can be called whenever needed
  // Or if you prefer, you can do it once at the top-level.
  const getContract = async () => {
    const signer = await signerFunction()
    return new Contract(CONTRACT_ADDRESS, stickyABI, signer)
  }

  // ================ Methods ================

  const mintNote = useCallback(
    async (
      name: string,
      description: string,
      text: string,
      color: string,
      fontSize: number,
      metadataURI: string
    ) => {
      try {
        const contract = await getContract()
        const tx = await contract.mint(name, description, text, color, fontSize, metadataURI)
        await tx.wait()
        console.log('Note minted successfully')
      } catch (error) {
        console.error('Error minting note:', error)
      }
    },
    []
  )

  const batchMintNotes = useCallback(
    async (
      recipients: string[],
      names: string[],
      descriptions: string[],
      texts: string[],
      colors: string[],
      fontSizes: number[],
      metadataURIs: string[]
    ) => {
      try {
        const contract = await getContract()
        const tx = await contract.batchMint(
          recipients,
          names,
          descriptions,
          texts,
          colors,
          fontSizes,
          metadataURIs
        )
        await tx.wait()
        console.log('Batch minting successful')
      } catch (error) {
        console.error('Error batch minting notes:', error)
      }
    },
    []
  )

  const burnNote = useCallback(async (tokenId: number) => {
    try {
      const contract = await getContract()
      const tx = await contract.burn(tokenId)
      await tx.wait()
      console.log('Note burned successfully')
    } catch (error) {
      console.error('Error burning note:', error)
    }
  }, [])

  const adminBurn = useCallback(async (tokenId: number) => {
    try {
      const contract = await getContract()
      const tx = await contract.adminBurn(tokenId)
      await tx.wait()
      console.log('Admin burn successful')
    } catch (error) {
      console.error('Error in admin burn:', error)
    }
  }, [])

  const approve = useCallback(async (to: string, tokenId: number) => {
    try {
      const contract = await getContract()
      const tx = await contract.approve(to, tokenId)
      await tx.wait()
      console.log('Approval successful')
    } catch (error) {
      console.error('Error in approval:', error)
    }
  }, [])

  const batchBurn = useCallback(async (tokenIds: number[]) => {
    try {
      const contract = await getContract()
      const tx = await contract.batchBurn(tokenIds)
      await tx.wait()
      console.log('Batch burn successful')
    } catch (error) {
      console.error('Error in batch burn:', error)
    }
  }, [])

  const safeTransferFrom = useCallback(
    async (from: string, to: string, tokenId: number, data: string = '') => {
      try {
        const contract = await getContract()
        const tx = await contract.safeTransferFrom(from, to, tokenId, data)
        await tx.wait()
        console.log('Safe transfer successful')
      } catch (error) {
        console.error('Error in safe transfer:', error)
      }
    },
    []
  )

  const setApprovalForAll = useCallback(async (operator: string, approved: boolean) => {
    try {
      const contract = await getContract()
      const tx = await contract.setApprovalForAll(operator, approved)
      await tx.wait()
      console.log('Set approval for all successful')
    } catch (error) {
      console.error('Error in setting approval for all:', error)
    }
  }, [])

  const transferFrom = useCallback(async (from: string, to: string, tokenId: number) => {
    try {
      const contract = await getContract()
      const tx = await contract.transferFrom(from, to, tokenId)
      await tx.wait()
      console.log('Transfer successful')
    } catch (error) {
      console.error('Error in transfer:', error)
    }
  }, [])

  const updateMetadata = useCallback(
    async (
      tokenId: number,
      name: string,
      description: string,
      text: string,
      color: string,
      fontSize: number,
      metadataURI: string
    ) => {
      try {
        const contract = await getContract()
        const tx = await contract.updateMetadata(
          tokenId,
          name,
          description,
          text,
          color,
          fontSize,
          metadataURI
        )
        await tx.wait()
        console.log('Metadata updated successfully')
      } catch (error) {
        console.error('Error updating metadata:', error)
      }
    },
    []
  )

  const getMetadata = useCallback(async (tokenId: number) => {
    try {
      const contract = await getContract()
      const metadata = await contract.getMetadata(tokenId)
      console.log('Metadata retrieved:', metadata)
      return metadata
    } catch (error) {
      console.error('Error retrieving metadata:', error)
    }
  }, [])

  const getNft = useCallback(async (owner: string) => {
    try {
      const contract = await getContract()
      const nfts = await contract.getNft(owner)
      console.log('NFTs retrieved:', nfts)
      return nfts
    } catch (error) {
      console.error('Error retrieving NFTs:', error)
    }
  }, [])

  const balanceOf = useCallback(async (owner: string) => {
    try {
      const contract = await getContract()
      const balance = await contract.balanceOf(owner)
      console.log('Balance retrieved:', balance)
      return balance
    } catch (error) {
      console.error('Error retrieving balance:', error)
    }
  }, [])

  const getApproved = useCallback(async (tokenId: number) => {
    try {
      const contract = await getContract()
      const approvedAddress = await contract.getApproved(tokenId)
      console.log('Approved address retrieved:', approvedAddress)
      return approvedAddress
    } catch (error) {
      console.error('Error retrieving approved address:', error)
    }
  }, [])

  const isApprovedForAll = useCallback(async (owner: string, operator: string) => {
    try {
      const contract = await getContract()
      const isApproved = await contract.isApprovedForAll(owner, operator)
      console.log('Is approved for all:', isApproved)
      return isApproved
    } catch (error) {
      console.error('Error checking approval for all:', error)
    }
  }, [])

  const ownerOf = useCallback(async (tokenId: number) => {
    try {
      const contract = await getContract()
      const owner = await contract.ownerOf(tokenId)
      console.log('Owner retrieved:', owner)
      return owner
    } catch (error) {
      console.error('Error retrieving owner:', error)
    }
  }, [])

  const tokenURI = useCallback(async (tokenId: number) => {
    try {
      const contract = await getContract()
      const uri = await contract.tokenURI(tokenId)
      console.log('Token URI retrieved:', uri)
      return uri
    } catch (error) {
      console.error('Error retrieving token URI:', error)
    }
  }, [])

  const totalSupply = useCallback(async () => {
    try {
      const contract = await getContract()
      const supply = await contract.totalSupply()
      console.log('Total supply retrieved:', supply)
      return supply
    } catch (error) {
      console.error('Error retrieving total supply:', error)
    }
  }, [])

  return {
    mintNote,
    batchMintNotes,
    burnNote,
    adminBurn,
    approve,
    batchBurn,
    safeTransferFrom,
    setApprovalForAll,
    transferFrom,
    updateMetadata,
    getMetadata,
    getNft,
    balanceOf,
    getApproved,
    isApprovedForAll,
    ownerOf,
    tokenURI,
    totalSupply,
  }
}

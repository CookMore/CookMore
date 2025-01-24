import { useCallback } from 'react'
import { ethers } from 'ethers'
import { stickyABI } from '@/app/api/blockchain/abis/sticky'

const CONTRACT_ADDRESS = '0xA5265C7B7B63f73b6c0Fc0a9034219e4B39372e6'

export const useNotesContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(CONTRACT_ADDRESS, stickyABI, signer)

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
        const tx = await contract.mint(name, description, text, color, fontSize, metadataURI)
        await tx.wait()
        console.log('Note minted successfully')
      } catch (error) {
        console.error('Error minting note:', error)
      }
    },
    [contract]
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
    [contract]
  )

  const burnNote = useCallback(
    async (tokenId: number) => {
      try {
        const tx = await contract.burn(tokenId)
        await tx.wait()
        console.log('Note burned successfully')
      } catch (error) {
        console.error('Error burning note:', error)
      }
    },
    [contract]
  )

  const adminBurn = useCallback(
    async (tokenId: number) => {
      try {
        const tx = await contract.adminBurn(tokenId)
        await tx.wait()
        console.log('Admin burn successful')
      } catch (error) {
        console.error('Error in admin burn:', error)
      }
    },
    [contract]
  )

  const approve = useCallback(
    async (to: string, tokenId: number) => {
      try {
        const tx = await contract.approve(to, tokenId)
        await tx.wait()
        console.log('Approval successful')
      } catch (error) {
        console.error('Error in approval:', error)
      }
    },
    [contract]
  )

  const batchBurn = useCallback(
    async (tokenIds: number[]) => {
      try {
        const tx = await contract.batchBurn(tokenIds)
        await tx.wait()
        console.log('Batch burn successful')
      } catch (error) {
        console.error('Error in batch burn:', error)
      }
    },
    [contract]
  )

  const safeTransferFrom = useCallback(
    async (from: string, to: string, tokenId: number, data: string = '') => {
      try {
        const tx = await contract.safeTransferFrom(from, to, tokenId, data)
        await tx.wait()
        console.log('Safe transfer successful')
      } catch (error) {
        console.error('Error in safe transfer:', error)
      }
    },
    [contract]
  )

  const setApprovalForAll = useCallback(
    async (operator: string, approved: boolean) => {
      try {
        const tx = await contract.setApprovalForAll(operator, approved)
        await tx.wait()
        console.log('Set approval for all successful')
      } catch (error) {
        console.error('Error in setting approval for all:', error)
      }
    },
    [contract]
  )

  const transferFrom = useCallback(
    async (from: string, to: string, tokenId: number) => {
      try {
        const tx = await contract.transferFrom(from, to, tokenId)
        await tx.wait()
        console.log('Transfer successful')
      } catch (error) {
        console.error('Error in transfer:', error)
      }
    },
    [contract]
  )

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
    [contract]
  )

  const getMetadata = useCallback(
    async (tokenId: number) => {
      try {
        const metadata = await contract.getMetadata(tokenId)
        console.log('Metadata retrieved:', metadata)
        return metadata
      } catch (error) {
        console.error('Error retrieving metadata:', error)
      }
    },
    [contract]
  )

  const getNft = useCallback(
    async (_owner: string) => {
      try {
        const nfts = await contract.getNft(_owner)
        console.log('NFTs retrieved:', nfts)
        return nfts
      } catch (error) {
        console.error('Error retrieving NFTs:', error)
      }
    },
    [contract]
  )

  const balanceOf = useCallback(
    async (owner: string) => {
      try {
        const balance = await contract.balanceOf(owner)
        console.log('Balance retrieved:', balance)
        return balance
      } catch (error) {
        console.error('Error retrieving balance:', error)
      }
    },
    [contract]
  )

  const getApproved = useCallback(
    async (tokenId: number) => {
      try {
        const approvedAddress = await contract.getApproved(tokenId)
        console.log('Approved address retrieved:', approvedAddress)
        return approvedAddress
      } catch (error) {
        console.error('Error retrieving approved address:', error)
      }
    },
    [contract]
  )

  const isApprovedForAll = useCallback(
    async (owner: string, operator: string) => {
      try {
        const isApproved = await contract.isApprovedForAll(owner, operator)
        console.log('Is approved for all:', isApproved)
        return isApproved
      } catch (error) {
        console.error('Error checking approval for all:', error)
      }
    },
    [contract]
  )

  const ownerOf = useCallback(
    async (tokenId: number) => {
      try {
        const owner = await contract.ownerOf(tokenId)
        console.log('Owner retrieved:', owner)
        return owner
      } catch (error) {
        console.error('Error retrieving owner:', error)
      }
    },
    [contract]
  )

  const tokenURI = useCallback(
    async (tokenId: number) => {
      try {
        const uri = await contract.tokenURI(tokenId)
        console.log('Token URI retrieved:', uri)
        return uri
      } catch (error) {
        console.error('Error retrieving token URI:', error)
      }
    },
    [contract]
  )

  const totalSupply = useCallback(async () => {
    try {
      const supply = await contract.totalSupply()
      console.log('Total supply retrieved:', supply)
      return supply
    } catch (error) {
      console.error('Error retrieving total supply:', error)
    }
  }, [contract])

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

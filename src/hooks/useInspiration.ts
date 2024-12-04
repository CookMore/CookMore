import { useContract } from './useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { getContractAddress } from '@/lib/web3/addresses'
import { useIpfs } from '../lib/web3/useIpfs'
import { useChangeLog } from './useChangeLog'
import { useRecipePreview } from './useRecipePreview'

export function useInspiration() {
  const recipeNftAddress = getContractAddress('RECIPE_NFT')
  const contract = useContract(recipeNftAddress, RECIPE_NFT_ABI)
  const { uploadToIpfs } = useIpfs()
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const addInspirationSource = async (recipeId: number, source: string) => {
    try {
      const tx = await contract.addInspirationSource(recipeId, source)
      await tx.wait()
      await logChange(recipeId, 'ADD_INSPIRATION', `Added inspiration source: ${source}`)
    } catch (error) {
      console.error('Error adding inspiration source:', error)
    }
  }

  const uploadInspirationImage = async (recipeId: number, file: File) => {
    try {
      const ipfsHash = await uploadToIpfs(file)
      const tx = await contract.addInspirationImage(recipeId, ipfsHash)
      await tx.wait()
      await logChange(recipeId, 'ADD_INSPIRATION_IMAGE', 'Added inspiration image')
      return ipfsHash
    } catch (error) {
      console.error('Error uploading inspiration image:', error)
      throw error
    }
  }

  return { addInspirationSource, uploadInspirationImage }
}

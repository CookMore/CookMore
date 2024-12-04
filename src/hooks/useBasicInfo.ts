import { useContract } from './useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from './useChangeLog'
import { useRecipePreview } from './useRecipePreview'

export function useBasicInfo() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateBasicInfo = async (recipeId: number, updates: any) => {
    try {
      const tx = await contract.updateBasicInfo(recipeId, JSON.stringify(updates))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_BASIC_INFO', 'Updated recipe basic information')
      await updatePreview('basicInfo', updates)
    } catch (error) {
      console.error('Error updating basic info:', error)
    }
  }

  return { updateBasicInfo }
}

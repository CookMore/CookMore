import { useContract } from '@/lib/web3/hooks/useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from '@/lib/web3/hooks/useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/types/recipe'

export function useEquipment() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateEquipmentList = async (recipeId: number, equipment: RecipeData['equipment']) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updateEquipment(recipeId, JSON.stringify(equipment))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_EQUIPMENT', 'Updated equipment list')
    } catch (error) {
      console.error('Error updating equipment:', error)
      throw error
    }
  }

  return { updateEquipmentList }
}

import { useContract } from '@/lib/web3/hooks/useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from '@/lib/web3/hooks/useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/types/recipe'

export function usePreProduction() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updatePreProductionTasks = async (
    recipeId: number,
    preProduction: RecipeData['preProduction']
  ) => {
    try {
      const tx = await contract.updatePreProduction(recipeId, JSON.stringify(preProduction))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_PREPRODUCTION', 'Updated pre-production tasks')
    } catch (error) {
      console.error('Error updating pre-production tasks:', error)
      throw error
    }
  }

  return { updatePreProductionTasks }
}

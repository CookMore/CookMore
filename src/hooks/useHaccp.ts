import { useContract } from './useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from './useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/types/recipe'

export function useHaccp() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateHaccpPlan = async (recipeId: number, haccpPlan: RecipeData['haccpPlan']) => {
    try {
      const tx = await contract.updateHaccpPlan(recipeId, JSON.stringify(haccpPlan))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_HACCP', 'Updated HACCP plan')
    } catch (error) {
      console.error('Error updating HACCP plan:', error)
      throw error
    }
  }

  return { updateHaccpPlan }
}

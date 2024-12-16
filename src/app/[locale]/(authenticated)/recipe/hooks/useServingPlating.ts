import { useContract } from '@/lib/web3/hooks/useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from '@/lib/web3/hooks/useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/app/api/types/recipe'

export function useServingPlating() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateServingPlating = async (
    recipeId: number,
    servingPlating: RecipeData['servingPlating']
  ) => {
    try {
      const tx = await contract.updateServingPlating(recipeId, JSON.stringify(servingPlating))
      await tx.wait()
      await logChange(
        recipeId,
        'UPDATE_SERVING_PLATING',
        'Updated serving and plating instructions'
      )
    } catch (error) {
      console.error('Error updating serving and plating:', error)
      throw error
    }
  }

  return { updateServingPlating }
}

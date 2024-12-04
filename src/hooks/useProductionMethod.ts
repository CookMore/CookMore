import { useContract } from './useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from './useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/types/recipe'

export function useProductionMethod() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateMethod = async (
    recipeId: number,
    productionMethod: RecipeData['productionMethod']
  ) => {
    try {
      const tx = await contract.updateProductionMethod(recipeId, JSON.stringify(productionMethod))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_METHOD', 'Updated production method')
    } catch (error) {
      console.error('Error updating production method:', error)
      throw error
    }
  }

  return { updateMethod }
}

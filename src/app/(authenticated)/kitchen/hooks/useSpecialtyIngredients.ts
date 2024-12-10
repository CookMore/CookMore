import { useContract } from '@/lib/web3/hooks/useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from '@/lib/web3/hooks/useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/types/recipe'

export function useSpecialtyIngredients() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateSpecialtyIngredients = async (
    recipeId: number,
    specialtyIngredients: RecipeData['specialtyIngredients']
  ) => {
    try {
      const tx = await contract.updateSpecialtyIngredients(
        recipeId,
        JSON.stringify(specialtyIngredients)
      )
      await tx.wait()
      await logChange(recipeId, 'UPDATE_SPECIALTY', 'Updated specialty ingredients')
    } catch (error) {
      console.error('Error updating specialty ingredients:', error)
      throw error
    }
  }

  return { updateSpecialtyIngredients }
}

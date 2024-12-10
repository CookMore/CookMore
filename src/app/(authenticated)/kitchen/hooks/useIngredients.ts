import { useContract } from '@/lib/web3/hooks/useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from '@/lib/web3/hooks/useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/types/recipe'

export function useIngredients() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateIngredientsList = async (
    recipeId: number,
    ingredients: RecipeData['ingredients'],
    groups: RecipeData['ingredientGroups']
  ) => {
    try {
      const tx = await contract.updateIngredients(recipeId, JSON.stringify({ ingredients, groups }))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_INGREDIENTS', 'Updated recipe ingredients')
    } catch (error) {
      console.error('Error updating ingredients:', error)
      throw error
    }
  }

  return { updateIngredientsList }
}

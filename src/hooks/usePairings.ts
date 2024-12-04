import { useContract } from './useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from './useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/types/recipe'

export function usePairings() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updatePairings = async (recipeId: number, pairings: RecipeData['pairings']) => {
    try {
      const tx = await contract.updatePairings(recipeId, JSON.stringify(pairings))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_PAIRINGS', 'Updated recipe pairings')
    } catch (error) {
      console.error('Error updating pairings:', error)
      throw error
    }
  }

  return { updatePairings }
}

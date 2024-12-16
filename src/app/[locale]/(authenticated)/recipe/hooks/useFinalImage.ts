import { useContract } from '@/lib/web3/hooks/useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from '@/lib/web3/hooks/useChangeLog'
import { useRecipePreview } from './useRecipePreview'
import { RecipeData } from '@/app/api/types/recipe'

export function useFinalImage() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateFinalImage = async (recipeId: number, imageUrl: string | undefined) => {
    try {
      const tx = await contract.updateFinalImage(recipeId, imageUrl || '')
      await tx.wait()
      await logChange(recipeId, 'UPDATE_IMAGE', 'Updated final recipe image')
    } catch (error) {
      console.error('Error updating final image:', error)
      throw error
    }
  }

  return { updateFinalImage }
}

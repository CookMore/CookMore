import { useContract } from '@/hooks/useContract'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useChangeLog } from '@/hooks/useChangeLog'
import { useRecipePreview } from '@/hooks/useRecipePreview'
import { RecipeData } from '@/types/recipe'

export function useTags() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateTags = async (
    recipeId: number,
    tags: {
      categories?: string[]
      cuisines?: string[]
      occasions?: string[]
      customTags?: string[]
    }
  ) => {
    try {
      const tx = await contract.updateTags(recipeId, JSON.stringify(tags))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_TAGS', 'Updated recipe tags')
    } catch (error) {
      console.error('Error updating tags:', error)
      throw error
    }
  }

  return { updateTags }
}

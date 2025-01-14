import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function usePairings() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updatePairings = async (recipeId: number, pairings: RecipeData['pairings']) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updatePairings(recipeId, JSON.stringify(pairings))
      await tx.wait()
      await addChange('Updated recipe pairings')
      await updatePreview('pairings', pairings)
    } catch (error) {
      console.error('Error updating pairings:', error)
      throw error
    }
  }

  return { updatePairings }
}

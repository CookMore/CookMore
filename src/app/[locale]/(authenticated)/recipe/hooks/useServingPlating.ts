import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useServingPlating() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updateServingPlating = async (
    recipeId: number,
    servingPlating: RecipeData['servingPlating']
  ) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updateServingPlating(recipeId, JSON.stringify(servingPlating))
      await tx.wait()
      await addChange('Updated serving and plating instructions')
      await updatePreview('servingPlating', servingPlating)
    } catch (error) {
      console.error('Error updating serving and plating:', error)
      throw error
    }
  }

  return { updateServingPlating }
}

import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useSpecialtyIngredients() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updateSpecialtyIngredients = async (
    recipeId: number,
    specialtyIngredients: RecipeData['specialtyIngredients']
  ) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updateSpecialtyIngredients(
        recipeId,
        JSON.stringify(specialtyIngredients)
      )
      await tx.wait()
      await addChange('Updated specialty ingredients')
      await updatePreview('specialtyIngredients', specialtyIngredients)
    } catch (error) {
      console.error('Error updating specialty ingredients:', error)
      throw error
    }
  }

  return { updateSpecialtyIngredients }
}

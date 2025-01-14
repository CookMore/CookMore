import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useIngredients() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updateIngredientsList = async (
    recipeId: number,
    ingredients: RecipeData['ingredients'],
    groups: RecipeData['ingredientGroups']
  ) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updateIngredients(recipeId, JSON.stringify({ ingredients, groups }))
      await tx.wait()
      await addChange('Updated recipe ingredients')
      await updatePreview('ingredients', { ingredients, groups })
    } catch (error) {
      console.error('Error updating ingredients:', error)
      throw error
    }
  }

  return { updateIngredientsList }
}

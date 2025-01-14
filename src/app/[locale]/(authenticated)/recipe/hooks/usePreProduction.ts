import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function usePreProduction() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updatePreProductionTasks = async (
    recipeId: number,
    preProduction: RecipeData['preProduction']
  ) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updatePreProduction(recipeId, JSON.stringify(preProduction))
      await tx.wait()
      await addChange('Updated pre-production tasks')
      await updatePreview('preProduction', preProduction)
    } catch (error) {
      console.error('Error updating pre-production tasks:', error)
      throw error
    }
  }

  return { updatePreProductionTasks }
}

import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useHaccp() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updateHaccpPlan = async (recipeId: number, haccpPlan: RecipeData['haccpPlan']) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updateHaccpPlan(recipeId, JSON.stringify(haccpPlan))
      await tx.wait()
      await addChange('Updated HACCP plan')
      await updatePreview('haccpPlan', haccpPlan)
    } catch (error) {
      console.error('Error updating HACCP plan:', error)
      throw error
    }
  }

  return { updateHaccpPlan }
}

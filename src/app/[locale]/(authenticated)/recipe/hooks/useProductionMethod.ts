import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useProductionMethod() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updateMethod = async (
    recipeId: number,
    productionMethod: RecipeData['productionMethod']
  ) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updateProductionMethod(recipeId, JSON.stringify(productionMethod))
      await tx.wait()
      await addChange('Updated production method')
      await updatePreview('productionMethod', productionMethod)
    } catch (error) {
      console.error('Error updating production method:', error)
      throw error
    }
  }

  return { updateMethod }
}

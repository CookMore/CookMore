import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useEquipment() {
  const { state } = useRecipe() // Access the context
  const { contract, addChange } = state // Get the contract and addChange from the context

  const updateEquipmentList = async (recipeId: number, equipment: RecipeData['equipment']) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const metadataURI = JSON.stringify(equipment)
      const tx = await contract.updateRecipe(recipeId, metadataURI)
      await tx.wait()
      await addChange('Updated equipment list')
    } catch (error) {
      console.error('Error updating equipment:', error)
      throw error
    }
  }

  return { updateEquipmentList }
}

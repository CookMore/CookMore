import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'

export function useFinalImage() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updateFinalImage = async (recipeId: number, imageUrl: string | undefined) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updateFinalImage(recipeId, imageUrl || '')
      await tx.wait()
      await addChange('Updated final recipe image')
      await updatePreview('finalImage', imageUrl)
    } catch (error) {
      console.error('Error updating final image:', error)
      throw error
    }
  }

  return { updateFinalImage }
}

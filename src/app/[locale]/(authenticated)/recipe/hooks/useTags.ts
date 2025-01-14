import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useTags() {
  const { state } = useRecipe()
  const { addChange, updatePreview } = state

  const updateTags = async (recipeId: number, updates: Partial<RecipeData>) => {
    try {
      // Simulate an API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Log the change
      await addChange('Updated tags')

      // Update the preview
      await updatePreview('tags', updates)

      return true
    } catch (error) {
      console.error('Failed to update tags:', error)
      throw error
    }
  }

  return {
    updateTags,
  }
}

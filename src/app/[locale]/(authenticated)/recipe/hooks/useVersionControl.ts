import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useVersionControl() {
  const { state } = useRecipe()
  const { addChange } = state

  const addFork = async (recipeId: string | number) => {
    try {
      // Simulate an API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Log the change
      await addChange(`Added fork for recipe ID: ${recipeId}`)

      return true
    } catch (error) {
      console.error('Failed to add fork:', error)
      throw error
    }
  }

  return {
    addFork,
  }
}

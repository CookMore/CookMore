import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { Skills } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useSkills() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  const updateSkills = async (recipeId: number, skills: Skills, category: keyof Skills) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.updateSkills(recipeId, JSON.stringify(skills))
      await tx.wait()
      await addChange(`Updated ${category} skills`)
      await updatePreview('skills', skills)
    } catch (error) {
      console.error('Error updating skills:', error)
      throw error
    }
  }

  return { updateSkills }
}

import { useEffect } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'

export function useBasicInfo() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange } = state

  useEffect(() => {
    if (!contract) {
      console.warn('Contract not initialized')
      // Handle contract initialization or other setup here if needed
    }
  }, [contract])

  const updateBasicInfo = async (recipeId: number, updates: any) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }

      const tx = await contract.updateBasicInfo(recipeId, JSON.stringify(updates))
      await tx.wait()

      await Promise.all([
        addChange('Updated recipe basic information'),
        updatePreview('basicInfo', updates),
      ])
    } catch (error) {
      console.error('Error updating basic info:', error)
      throw error
    }
  }

  return { updateBasicInfo }
}

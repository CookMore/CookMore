import { useContract } from '@/lib/web3/hooks/useContract'
import { useChangeLog } from '@/lib/web3/hooks/useChangeLog'
import { RECIPE_NFT_ABI } from '@/lib/web3/abis'
import { RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { useRecipePreview } from './useRecipePreview'
import { Skills } from '@/app/api/types/recipe'

export function useSkills() {
  const contract = useContract(RECIPE_NFT_ADDRESS, RECIPE_NFT_ABI)
  const { logChange } = useChangeLog()
  const { updatePreview } = useRecipePreview()

  const updateSkills = async (recipeId: number, skills: Skills, category: keyof Skills) => {
    try {
      const tx = await contract.updateSkills(recipeId, JSON.stringify(skills))
      await tx.wait()
      await logChange(recipeId, 'UPDATE_SKILLS', `Updated ${category} skills`)
    } catch (error) {
      console.error('Error updating skills:', error)
      throw error
    }
  }

  return { updateSkills }
}

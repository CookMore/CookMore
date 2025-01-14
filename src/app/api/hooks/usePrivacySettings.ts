import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'
import { Contract } from 'ethers'

// Define the contract interface
interface PrivacySettingsContract extends Contract {
  setPrivacy: (recipeId: string, privacyType: number) => Promise<any>
  addToAllowlist: (recipeId: string, address: string) => Promise<any>
}

// Define the return type of the hook
export interface PrivacySettingsHook {
  setPrivacy: (recipeId: string, privacyType: number) => Promise<void>
  addToAllowlist: (recipeId: string, address: string) => Promise<void>
}

export function usePrivacySettings(): PrivacySettingsHook {
  const { state } = useRecipe()
  const contract = state.contract as PrivacySettingsContract

  const setPrivacy = async (recipeId: string, privacyType: number): Promise<void> => {
    try {
      const tx = await contract.setPrivacy(recipeId, privacyType)
      await tx.wait()
    } catch (error) {
      console.error('Error setting privacy:', error)
      throw error // Re-throw to handle in component
    }
  }

  const addToAllowlist = async (recipeId: string, address: string): Promise<void> => {
    try {
      const tx = await contract.addToAllowlist(recipeId, address)
      await tx.wait()
    } catch (error) {
      console.error('Error adding to allowlist:', error)
      throw error // Re-throw to handle in component
    }
  }

  return { setPrivacy, addToAllowlist }
}

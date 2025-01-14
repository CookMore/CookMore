import { useState } from 'react'
import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'

export function useRecipeUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { state } = useRecipe()
  const { contract, ipfsService } = state

  const uploadRecipe = async (recipeData: any) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }

      setIsUploading(true)

      // Create full recipe metadata
      const recipeMetadata = { ...recipeData }

      // Upload recipe metadata to IPFS
      const metadataCid = await ipfsService.uploadMetadata(recipeMetadata)

      // Mint NFT with metadata CID
      const metadataUri = `ipfs://${metadataCid}`
      const tx = await contract.createRecipe(metadataUri)
      await tx.wait()

      return metadataUri
    } catch (error) {
      console.error('Recipe upload failed:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadRecipe,
    isUploading,
  }
}

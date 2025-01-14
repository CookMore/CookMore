import { useRecipe } from '@/app/[locale]/(authenticated)/recipe/context/RecipeContext'

export function useInspiration() {
  const { state } = useRecipe()
  const { contract, updatePreview, addChange, uploadToIpfs } = state

  const addInspirationSource = async (recipeId: number, source: string) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized')
      }
      const tx = await contract.addInspirationSource(recipeId, source)
      await tx.wait()
      await addChange(`Added inspiration source: ${source}`)
      await updatePreview('inspirationSource', source)
    } catch (error) {
      console.error('Error adding inspiration source:', error)
      throw error
    }
  }

  const uploadInspirationImage = async (recipeId: number, file: File) => {
    try {
      const ipfsHash = await uploadToIpfs(file)
      const tx = await contract.addInspirationImage(recipeId, ipfsHash)
      await tx.wait()
      await addChange('Added inspiration image')
      await updatePreview('inspirationImage', ipfsHash)
      return ipfsHash
    } catch (error) {
      console.error('Error uploading inspiration image:', error)
      throw error
    }
  }

  return { addInspirationSource, uploadInspirationImage }
}

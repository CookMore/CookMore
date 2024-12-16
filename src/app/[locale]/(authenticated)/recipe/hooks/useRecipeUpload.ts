import { useState } from 'react'
import { useContractWrite } from 'wagmi'
import { RECIPE_NFT_ABI, RECIPE_NFT_ADDRESS } from '@/lib/web3/addresses'
import { ipfsService } from '@/lib/services/ipfs-service'
import { useUploadThing } from '@/lib/utils/uploadthing'

export function useRecipeUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { startUpload } = useUploadThing('recipeImage')

  const { write: createRecipe } = useContractWrite({
    address: RECIPE_NFT_ADDRESS,
    abi: RECIPE_NFT_ABI,
    functionName: 'createRecipe',
  })

  const uploadRecipe = async (
    image: File,
    recipeData: any // Your recipe metadata type
  ) => {
    try {
      setIsUploading(true)

      // 1. Upload image using UploadThing
      const [imageResult] = await startUpload([image])
      if (!imageResult) throw new Error('Failed to upload image')

      // 2. Create full recipe metadata
      const recipeMetadata = {
        ...recipeData,
        image: imageResult.url,
        imageCid: imageResult.metadataCid,
      }

      // 3. Upload recipe metadata to IPFS
      const metadataCid = await ipfsService.uploadMetadata(recipeMetadata)

      // 4. Mint NFT with metadata CID
      const metadataUri = `ipfs://${metadataCid}`
      await createRecipe({ args: [metadataUri] })

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

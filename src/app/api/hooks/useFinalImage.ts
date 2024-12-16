'use client'

import { useState, useCallback } from 'react'
import { useRecipe } from '@/app/providers/RecipeProvider'
import { ipfsService } from '@/lib/services/ipfs-service'

export function useFinalImage() {
  const { recipeData, updateRecipe } = useRecipe()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadImage = useCallback(
    async (file: File) => {
      setIsLoading(true)
      setError(null)

      try {
        const ipfsHash = await ipfsService.upload(file)
        const imageUrl = `ipfs://${ipfsHash}`
        await updateRecipe({
          finalImageDetails: {
            finalImage: imageUrl,
          },
        })
        return imageUrl
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to upload image'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [updateRecipe]
  )

  const removeImage = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await updateRecipe({
        finalImageDetails: {
          finalImage: '',
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove image'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [updateRecipe])

  return {
    finalImage: recipeData?.finalImageDetails?.finalImage,
    uploadImage,
    removeImage,
    isLoading,
    error,
  }
}

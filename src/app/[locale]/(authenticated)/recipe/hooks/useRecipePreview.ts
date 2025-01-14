import { useCallback } from 'react'
import { RecipeData } from '@/app/[locale]/(authenticated)/recipe/types/recipe'

export function useRecipePreview() {
  const updatePreview = useCallback(async (section: string, updates: Partial<RecipeData>) => {
    // Update the preview component with new data
    const previewElement = document.getElementById('recipe-preview')
    if (previewElement) {
      const event = new CustomEvent('recipe-update', {
        detail: { section, updates },
      })
      previewElement.dispatchEvent(event)
    }
  }, [])

  return { updatePreview }
}

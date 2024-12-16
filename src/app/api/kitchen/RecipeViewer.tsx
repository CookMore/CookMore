'use client'

import React from 'react'

interface RecipeViewerProps {
  recipeId: string
}

export function RecipeViewer({ recipeId }: RecipeViewerProps) {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer) // Cleanup the timer on component unmount
  }, [])

  if (loading) {
    return (
      <div className='animate-pulse'>
        <div className='h-8 bg-github-canvas-subtle rounded w-1/3 mb-4'></div>
        <div className='h-32 bg-github-canvas-subtle rounded mb-4'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-github-danger-fg p-4 rounded-lg border border-github-danger-emphasis'>
        {error}
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-github-fg-default'>Recipe #{recipeId}</h1>
      </div>

      {/* Placeholder for recipe content */}
      <div className='border border-github-border-default rounded-lg p-4'>
        <p className='text-github-fg-muted'>Recipe content will go here</p>
        <img
          src={`https://example.com/recipe/${recipeId}/image.jpg`} // Replace with actual image URL
          alt={`Recipe ${recipeId}`}
          onError={() => setError('Failed to load recipe image.')}
          className='w-full h-auto'
        />
      </div>
    </div>
  )
}

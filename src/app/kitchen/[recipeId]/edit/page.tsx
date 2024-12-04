'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { RecipeEditor } from '@/components/kitchen/RecipeEditor'

export default function EditRecipePage() {
  const params = useParams()
  const recipeId = params.recipeId as string

  return (
    <div className='max-w-screen-xl mx-auto py-8 px-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-github-fg-default'>Edit Recipe</h1>
        <p className='text-github-fg-muted'>Make changes to your recipe</p>
      </div>
      <RecipeEditor recipeId={recipeId} />
    </div>
  )
}

'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RecipeEditor } from '@/components/kitchen/RecipeEditor'

export default function ForkRecipePage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = params.recipeId as string

  return (
    <div className='max-w-screen-xl mx-auto py-8 px-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-github-fg-default'>Fork Recipe</h1>
        <p className='text-github-fg-muted'>Create your own version of this recipe</p>
      </div>
      <RecipeEditor
        recipeId={recipeId}
        mode='fork'
        onSave={(newId) => router.push(`/kitchen/${newId}`)}
      />
    </div>
  )
}

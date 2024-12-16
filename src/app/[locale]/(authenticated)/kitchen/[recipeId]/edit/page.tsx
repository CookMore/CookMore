'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { RecipeEditor } from '@/components/kitchen/RecipeEditor'
import { PageHeader } from '@/components/ui/PageHeader'

export default function EditRecipePage() {
  const params = useParams()
  const recipeId = params.recipeId as string

  return (
    <div>
      <PageHeader title='Edit Recipe' />
      <div className='max-w-screen-xl mx-auto py-8 px-4'>
        <p className='text-github-fg-muted'>Make changes to your recipe</p>
        <RecipeEditor recipeId={recipeId} />
      </div>
    </div>
  )
}

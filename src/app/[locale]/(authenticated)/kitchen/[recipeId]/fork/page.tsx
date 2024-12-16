'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RecipeEditor } from '@/components/kitchen/RecipeEditor'
import { PageHeader } from '@/components/ui/PageHeader'

export default function ForkRecipePage() {
  const params = useParams()
  const router = useRouter()
  const recipeId = params.recipeId as string

  return (
    <div>
      <PageHeader title='Fork Recipe' />
      <div className='max-w-screen-xl mx-auto py-8 px-4'>
        <p className='text-github-fg-muted'>Create your own version of this recipe</p>
        <RecipeEditor
          recipeId={recipeId}
          mode='fork'
          onSave={(newId) => router.push(`/kitchen/${newId}`)}
        />
      </div>
    </div>
  )
}

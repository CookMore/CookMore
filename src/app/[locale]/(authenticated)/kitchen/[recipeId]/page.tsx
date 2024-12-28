'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { PageHeader } from '@/app/api/header/PageHeader'

export default function RecipeIdPage() {
  const params = useParams()
  const recipeId = params.recipeId as string

  return (
    <div>
      <PageHeader title={`Recipe ${recipeId}`} />
    </div>
  )
}

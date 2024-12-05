'use client'

import React from 'react'
import { useParams } from 'next/navigation'

export default function RecipeIdPage() {
  const params = useParams()
  const recipeId = params.recipeId as string

  return (
    <div>
      <h1>Recipe {recipeId}</h1>
    </div>
  )
}

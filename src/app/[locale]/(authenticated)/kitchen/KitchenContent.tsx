'use client'

import { RecipeFilters } from '@/app/api/kitchen/RecipeFilters'
import KitchenStats from '@/app/api/kitchen/KitchenStats'
import RecipeCollection from '@/app/api/kitchen/RecipeCollection'

export default function KitchenContent() {
  return (
    <div className='space-y-8'>
      <KitchenStats />
      <RecipeFilters />
      <RecipeCollection title='Recent Recipes' type='recent' />
      <RecipeCollection title='Draft Recipes' type='draft' />
      <RecipeCollection title='Popular Recipes' type='popular' />
    </div>
  )
}

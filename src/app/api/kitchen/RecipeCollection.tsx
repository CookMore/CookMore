'use client'

import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { RecipeCard } from './RecipeCard'
import { useKitchen } from '@/app/(authenticated)/kitchen/KitchenProvider'
import { Recipe } from '@/app/api/types/recipe'

interface RecipeCollectionProps {
  title: string
  type: 'recent' | 'draft' | 'popular'
}

export function RecipeCollection({ title, type }: RecipeCollectionProps) {
  const { recipes, isLoading } = useKitchen()

  // Filter and sort recipes based on type
  const filteredRecipes = recipes
    ?.filter((recipe: Recipe) => {
      switch (type) {
        case 'recent':
          return !recipe.isDraft
        case 'draft':
          return !!recipe.isDraft
        case 'popular':
          return !recipe.isDraft && ((recipe.cookCount ?? 0) > 0 || (recipe.likes ?? 0) > 0)
        default:
          return true
      }
    })
    .sort((a: Recipe, b: Recipe) => {
      switch (type) {
        case 'recent':
          return new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
        case 'draft':
          return new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
        case 'popular':
          // Sort by combined popularity (cook count + likes)
          const aPopularity = (a.cookCount ?? 0) + (a.likes ?? 0)
          const bPopularity = (b.cookCount ?? 0) + (b.likes ?? 0)
          return bPopularity - aPopularity
        default:
          return 0
      }
    })
    .slice(0, 4) // Show max 4 recipes per collection

  const getEmptyStateMessage = () => {
    switch (type) {
      case 'recent':
        return "You haven't published any recipes yet"
      case 'draft':
        return "You don't have any recipes in progress"
      case 'popular':
        return 'No popular recipes yet'
      default:
        return 'No recipes found'
    }
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        {isLoading ? (
          <Icons.spinner className='h-4 w-4 animate-spin' />
        ) : (
          filteredRecipes?.length > 0 && (
            <button className='text-sm text-github-fg-muted hover:text-github-fg-default'>
              View all <Icons.chevronRight className='inline h-4 w-4' />
            </button>
          )
        )}
      </div>

      {!filteredRecipes?.length ? (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <Icons.book className='h-12 w-12 text-github-fg-muted mb-4' />
          <h3 className='text-lg font-medium mb-2'>No recipes yet</h3>
          <p className='text-sm text-github-fg-muted'>{getEmptyStateMessage()}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {filteredRecipes?.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      )}
    </div>
  )
}

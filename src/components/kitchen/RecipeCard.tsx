'use client'

import Link from 'next/link'
import { Recipe } from '@/types/recipe'
import { IconStar, IconGitBranch } from '@/components/ui/icons'
import { formatDistanceToNow } from 'date-fns'

interface RecipeCardProps {
  recipe: Recipe
  viewMode: 'list' | 'grid'
}

export function RecipeCard({ recipe, viewMode }: RecipeCardProps) {
  const cardClasses =
    viewMode === 'grid'
      ? 'p-4 border border-github-border-default rounded-md hover:border-github-border-default-hover'
      : 'p-4 border-b border-github-border-default hover:bg-github-canvas-subtle'

  return (
    <div className={cardClasses}>
      <div className='flex items-start justify-between'>
        <div>
          <Link
            href={`/recipes/${recipe.id}`}
            className='text-github-accent-fg hover:underline font-semibold'
          >
            {recipe.name}
          </Link>
          <p className='mt-1 text-sm text-github-fg-muted line-clamp-2'>{recipe.description}</p>
        </div>
        <button className='ml-4 text-github-fg-muted hover:text-github-accent-fg'>
          <IconStar className='w-5 h-5' />
        </button>
      </div>

      <div className='mt-4 flex items-center text-sm text-github-fg-muted space-x-4'>
        <div className='flex items-center space-x-1'>
          <IconStar className='w-4 h-4' />
          <span>{recipe.stars}</span>
        </div>
        <div className='flex items-center space-x-1'>
          <IconGitBranch className='w-4 h-4' />
          <span>{recipe.forks.length}</span>
        </div>
        <div>Updated {formatDistanceToNow(new Date(recipe.updatedAt), { addSuffix: true })}</div>
      </div>
    </div>
  )
}

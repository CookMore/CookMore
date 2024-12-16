'use client'

import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Recipe } from '@/app/api/types/recipe'

interface RecipeCardProps {
  recipe: Recipe
  className?: string
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  return (
    <Link
      href={recipe?.id ? `/kitchen/recipe/${recipe.id}` : '#'}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-github-border-default',
        'hover:border-github-border-muted transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      <div className='aspect-video relative'>
        {recipe.image ? (
          <Image src={recipe.image} alt={recipe.title} fill className='object-cover' />
        ) : (
          <div className='absolute inset-0 bg-github-canvas-subtle flex items-center justify-center'>
            <Icons.image className='h-8 w-8 text-github-fg-muted' />
          </div>
        )}
        {recipe.isDraft && (
          <div className='absolute top-2 right-2 bg-github-canvas-default rounded-full p-1'>
            <Icons.lock className='h-4 w-4 text-github-fg-muted' />
          </div>
        )}
      </div>

      <div className='p-4'>
        <h3 className='font-medium mb-1 group-hover:text-github-accent-fg'>{recipe.title}</h3>
        <p className='text-sm text-github-fg-muted line-clamp-2'>{recipe.description}</p>

        <div className='mt-4 flex items-center text-sm text-github-fg-muted'>
          <Icons.heart className='h-4 w-4 mr-1' />
          <span>{recipe.likes ?? 0}</span>
          <Icons.messageSquare className='h-4 w-4 ml-4 mr-1' />
          <span>{recipe.comments ?? 0}</span>
          {(recipe.cookCount ?? 0) > 0 && (
            <>
              <Icons.users className='h-4 w-4 ml-4 mr-1' />
              <span>{recipe.cookCount}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

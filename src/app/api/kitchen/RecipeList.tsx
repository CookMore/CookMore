'use client'

import { useState, useEffect } from 'react'
import { Recipe } from '@/app/api/types/recipe'
import { recipeService } from '@/lib/services/recipes'
import { RecipeCard } from './RecipeCard'
import { IconList, IconGrid } from '@/components/ui/icons'

type ViewMode = 'list' | 'grid'

export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<'updated' | 'stars'>('updated')

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await recipeService.getRecipes()
        setRecipes(data)
      } catch (error) {
        console.error('Failed to load recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      {/* List Header */}
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <h1 className='text-xl font-semibold text-github-fg-default'>Your Recipes</h1>
          <div className='flex items-center space-x-2 border border-github-border-default rounded-md'>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-github-canvas-subtle text-github-fg-default'
                  : 'text-github-fg-muted hover:text-github-fg-default'
              }`}
            >
              <IconList className='w-4 h-4' />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-github-canvas-subtle text-github-fg-default'
                  : 'text-github-fg-muted hover:text-github-fg-default'
              }`}
            >
              <IconGrid className='w-4 h-4' />
            </button>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'updated' | 'stars')}
            className='px-2 py-1 text-sm bg-github-canvas-subtle border border-github-border-default rounded-md'
          >
            <option value='updated'>Last updated</option>
            <option value='stars'>Most stars</option>
          </select>
        </div>
      </div>

      {/* Recipe Grid/List */}
      {loading ? (
        <div className='text-center py-8 text-github-fg-muted'>Loading recipes...</div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import React from 'react'

interface RecipeFiltersProps {
  className?: string
}

export function RecipeFilters({ className }: RecipeFiltersProps) {
  return (
    <div className={`flex gap-4 items-center ${className}`}>
      <select className='bg-github-canvas-subtle border border-github-border-default rounded-md px-3 py-2'>
        <option value='all'>All Recipes</option>
        <option value='public'>Public</option>
        <option value='private'>Private</option>
      </select>
      <input
        type='search'
        placeholder='Search recipes...'
        className='bg-github-canvas-subtle border border-github-border-default rounded-md px-3 py-2'
      />
    </div>
  )
}

'use client'

import React from 'react'

interface KitchenStatsProps {
  className?: string
}

export function KitchenStats({ className }: KitchenStatsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      <div className='p-6 bg-github-canvas-subtle rounded-lg'>
        <h3 className='text-sm font-medium text-github-fg-default mb-2'>Total Recipes</h3>
        <p className='text-2xl font-bold text-github-fg-default'>0</p>
      </div>
      <div className='p-6 bg-github-canvas-subtle rounded-lg'>
        <h3 className='text-sm font-medium text-github-fg-default mb-2'>Forks</h3>
        <p className='text-2xl font-bold text-github-fg-default'>0</p>
      </div>
      <div className='p-6 bg-github-canvas-subtle rounded-lg'>
        <h3 className='text-sm font-medium text-github-fg-default mb-2'>Contributions</h3>
        <p className='text-2xl font-bold text-github-fg-default'>0</p>
      </div>
    </div>
  )
}

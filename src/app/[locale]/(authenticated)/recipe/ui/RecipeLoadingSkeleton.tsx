import React from 'react'

export function RecipeLoadingSkeleton() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='h-12 bg-gray-200 mb-4'></div> {/* Header Skeleton */}
      <div className='flex'>
        <div className='w-64 bg-gray-200 h-full'></div> {/* Sidebar Skeleton */}
        <div className='flex-1 p-4'>
          <div className='space-y-4'>
            <div className='h-8 bg-gray-200'></div> {/* Content Skeleton */}
            <div className='h-8 bg-gray-200'></div>
            <div className='h-8 bg-gray-200'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

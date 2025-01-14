import React from 'react'

export function HeaderLoadingSkeleton() {
  return (
    <header className='sticky top-0 z-[99] w-full border-b border-github-border-default bg-github-canvas-default'>
      <div className='flex h-16 items-center justify-between'>
        <div className='flex items-center pl-4'>
          <div className='w-24 h-6 bg-gray-200 rounded'></div> {/* Logo Skeleton */}
        </div>

        <div className='hidden lg:block flex-1 px-4'>
          <div className='w-full h-6 bg-gray-200 rounded'></div> {/* Navigation Skeleton */}
        </div>

        <div className='flex items-center space-x-4 pr-4'>
          <div className='w-6 h-6 bg-gray-200 rounded-full'></div> {/* Icon Skeleton */}
          <div className='w-6 h-6 bg-gray-200 rounded-full'></div> {/* Icon Skeleton */}
        </div>
      </div>
    </header>
  )
}

'use client'

import { LoadingSpinner } from '@/app/api/loading/LoadingSpinner'

export function CreateProfileSkeleton() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex gap-8'>
        {/* Left Sidebar Skeleton */}
        <div className='w-64 shrink-0 space-y-4'>
          {/* Step buttons skeleton - match the actual number of basic steps */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex items-center space-x-3 w-full p-3 rounded-lg bg-github-canvas-subtle animate-pulse'
            >
              {/* Step icon skeleton */}
              <div className='w-5 h-5 rounded-full bg-github-canvas-default' />
              <div className='flex-1 space-y-2'>
                {/* Step name skeleton */}
                <div className='h-4 w-24 bg-github-canvas-default rounded' />
                {/* Step description skeleton */}
                <div className='h-3 w-32 bg-github-canvas-default rounded' />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className='flex-1 space-y-6'>
          {/* Session Warning Skeleton */}
          <div className='bg-github-canvas-subtle border border-github-border-default rounded-lg p-4 animate-pulse'>
            <div className='h-4 w-3/4 bg-github-canvas-default rounded' />
          </div>

          {/* Header with loading indicator */}
          <div className='flex flex-col items-center justify-center space-y-4'>
            <h1 className='text-2xl font-bold text-github-fg-default'>Creating Your Profile</h1>
            <div className='flex items-center space-x-3'>
              <LoadingSpinner size='sm' />
              <span className='text-sm text-github-fg-muted'>Checking NFT tiers...</span>
            </div>
          </div>

          {/* Form Section Skeleton */}
          <div className='bg-github-canvas-default rounded-lg border border-github-border-default p-6 space-y-6'>
            {/* Form fields skeleton */}
            <div className='space-y-4'>
              {/* Basic Info Fields */}
              <div className='space-y-2'>
                <div className='h-4 w-24 bg-github-canvas-subtle rounded animate-pulse' />
                <div className='h-10 w-full bg-github-canvas-subtle rounded animate-pulse' />
              </div>
              {/* Bio Field */}
              <div className='space-y-2'>
                <div className='h-4 w-32 bg-github-canvas-subtle rounded animate-pulse' />
                <div className='h-24 w-full bg-github-canvas-subtle rounded animate-pulse' />
              </div>
              {/* Additional Field */}
              <div className='space-y-2'>
                <div className='h-4 w-28 bg-github-canvas-subtle rounded animate-pulse' />
                <div className='h-10 w-full bg-github-canvas-subtle rounded animate-pulse' />
              </div>
            </div>

            {/* Navigation buttons skeleton */}
            <div className='flex justify-between pt-6'>
              <div className='h-9 w-24 bg-github-canvas-subtle rounded animate-pulse' />
              <div className='h-9 w-24 bg-github-canvas-subtle rounded animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

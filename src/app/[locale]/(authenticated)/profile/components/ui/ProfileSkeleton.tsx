'use client'

export function ProfileSkeleton() {
  return (
    <div className='bg-github-canvas-default rounded-lg border border-github-border-default p-6 space-y-6 animate-pulse'>
      <div className='flex justify-between items-start'>
        <div className='flex items-center space-x-4'>
          {/* Avatar skeleton */}
          <div className='w-16 h-16 rounded-full bg-github-canvas-subtle' />

          <div className='space-y-2'>
            {/* Name skeleton */}
            <div className='h-7 w-48 bg-github-canvas-subtle rounded' />
            {/* Title skeleton */}
            <div className='h-5 w-32 bg-github-canvas-subtle rounded' />
          </div>
        </div>

        {/* Edit button skeleton */}
        <div className='h-9 w-28 bg-github-canvas-subtle rounded' />
      </div>

      {/* Bio skeleton */}
      <div className='space-y-2'>
        <div className='h-4 w-full bg-github-canvas-subtle rounded' />
        <div className='h-4 w-3/4 bg-github-canvas-subtle rounded' />
        <div className='h-4 w-1/2 bg-github-canvas-subtle rounded' />
      </div>
    </div>
  )
}

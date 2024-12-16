'use client'

export function FormSkeleton() {
  return (
    <div className='space-y-6 animate-pulse'>
      {/* Header skeleton */}
      <div className='space-y-2'>
        <div className='h-8 w-48 bg-github-canvas-subtle rounded-md' />
        <div className='h-4 w-96 bg-github-canvas-subtle rounded-md' />
      </div>

      {/* Form fields skeleton */}
      <div className='space-y-8'>
        {/* Field group 1 */}
        <div className='space-y-4'>
          <div className='h-4 w-24 bg-github-canvas-subtle rounded-md' />
          <div className='h-10 w-full bg-github-canvas-subtle rounded-md' />
        </div>

        {/* Field group 2 */}
        <div className='space-y-4'>
          <div className='h-4 w-32 bg-github-canvas-subtle rounded-md' />
          <div className='h-24 w-full bg-github-canvas-subtle rounded-md' />
        </div>

        {/* Field group 3 */}
        <div className='space-y-4'>
          <div className='h-4 w-28 bg-github-canvas-subtle rounded-md' />
          <div className='h-10 w-full bg-github-canvas-subtle rounded-md' />
        </div>
      </div>

      {/* Button skeleton */}
      <div className='h-10 w-32 bg-github-canvas-subtle rounded-md' />
    </div>
  )
}

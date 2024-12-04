'use client'

export function FormSkeleton() {
  return (
    <div className='w-full'>
      {/* Warning Banner Skeleton */}
      <div className='w-full mb-6'>
        <div className='bg-github-canvas-subtle rounded-lg h-24 animate-pulse' />
      </div>

      <div className='flex w-full'>
        {/* Sidebar Skeleton */}
        <div className='w-64 shrink-0 border-r border-github-border-default'>
          <div className='p-4 space-y-3'>
            {/* Step indicators */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className='flex items-center space-x-3'>
                <div className='w-8 h-8 rounded-full bg-github-canvas-subtle animate-pulse' />
                <div className='flex-1 h-4 bg-github-canvas-subtle rounded animate-pulse' />
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Content */}
        <div className='flex-1 ml-64 p-6'>
          <div className='max-w-3xl mx-auto space-y-8'>
            {/* Instructions Box */}
            <div className='bg-github-canvas-subtle rounded-lg h-16 animate-pulse' />

            {/* Banner Image Placeholder */}
            <div className='relative'>
              <div className='w-full h-48 bg-github-canvas-subtle rounded-lg animate-pulse' />
              {/* Avatar Placeholder */}
              <div className='absolute -bottom-6 left-4'>
                <div className='w-24 h-24 rounded-full bg-github-canvas-subtle animate-pulse border-4 border-github-canvas-default' />
              </div>
            </div>

            {/* Form Fields */}
            <div className='space-y-6 mt-12'>
              {/* Basic Info Section */}
              <div className='space-y-4'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='space-y-2'>
                    <div className='h-4 w-24 bg-github-canvas-subtle rounded animate-pulse' />
                    <div className='h-10 bg-github-canvas-subtle rounded-md animate-pulse' />
                  </div>
                ))}
              </div>

              {/* Additional Sections */}
              <div className='border-t border-github-border-default pt-6'>
                <div className='space-y-4'>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className='space-y-2'>
                      <div className='h-4 w-32 bg-github-canvas-subtle rounded animate-pulse' />
                      <div className='h-10 bg-github-canvas-subtle rounded-md animate-pulse' />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className='flex justify-between pt-6 mt-8 border-t border-github-border-default'>
              <div className='w-24 h-10 bg-github-canvas-subtle rounded-md animate-pulse' />
              <div className='flex space-x-4'>
                <div className='w-24 h-10 bg-github-canvas-subtle rounded-md animate-pulse' />
                <div className='w-24 h-10 bg-github-canvas-subtle rounded-md animate-pulse' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

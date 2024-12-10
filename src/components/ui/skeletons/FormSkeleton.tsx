'use client'

export function FormSkeleton() {
  return (
    <div className='w-full h-full min-h-screen bg-github-canvas-default'>
      <div className='animate-pulse space-y-8 p-6 max-w-4xl mx-auto'>
        {/* Form Section Skeletons */}
        <div className='space-y-6'>
          {/* Section Header */}
          <div className='space-y-2'>
            <div className='h-6 w-1/3 bg-github-canvas-subtle rounded' />
            <div className='h-4 w-2/3 bg-github-canvas-subtle rounded opacity-70' />
          </div>

          {/* Form Fields */}
          <div className='space-y-4'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='space-y-2'>
                <div className='h-4 w-1/4 bg-github-canvas-subtle rounded' />
                <div className='h-10 w-full bg-github-canvas-subtle rounded' />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Sections */}
        <div className='space-y-6'>
          <div className='h-6 w-1/4 bg-github-canvas-subtle rounded' />
          <div className='grid gap-4'>
            {[1, 2].map((i) => (
              <div key={i} className='h-12 bg-github-canvas-subtle rounded' />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

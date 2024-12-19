'use client'

export function AdminSkeleton() {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6 animate-pulse'>
        <div className='h-8 bg-github-canvas-subtle rounded w-3/4 mx-auto' />
        <div className='space-y-4'>
          <div className='h-12 bg-github-canvas-subtle rounded' />
          <div className='h-12 bg-github-canvas-subtle rounded' />
        </div>
      </div>
    </div>
  )
}

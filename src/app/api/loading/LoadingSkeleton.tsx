import { cn } from '@/app/api/utils/utils'

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse space-y-4', className)}>
      <div className='h-4 bg-github-canvas-subtle rounded w-3/4' />
      <div className='h-4 bg-github-canvas-subtle rounded w-1/2' />
      <div className='h-4 bg-github-canvas-subtle rounded w-5/6' />
      <div className='h-4 bg-github-canvas-subtle rounded w-2/3' />
      <div className='grid grid-cols-2 gap-4'>
        <div className='h-8 bg-github-canvas-subtle rounded' />
        <div className='h-8 bg-github-canvas-subtle rounded' />
      </div>
    </div>
  )
}

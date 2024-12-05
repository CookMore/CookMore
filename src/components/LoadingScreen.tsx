'use client'

interface LoadingScreenProps {
  title?: string
  showLogo?: boolean
}

export function LoadingScreen({ title = 'CookMore', showLogo = true }: LoadingScreenProps) {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        {showLogo && <h1 className='text-4xl font-bold text-github-fg-default mb-8'>{title}</h1>}
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-success-emphasis mb-4 mx-auto'></div>
        <p className='text-github-fg-muted mb-2'>Initializing...</p>
        <p className='text-sm text-github-fg-subtle'>Setting up your secure environment</p>
      </div>
    </div>
  )
}

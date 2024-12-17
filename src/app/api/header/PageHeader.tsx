'use client'

interface PageHeaderProps {
  title: string
  children?: React.ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className='border-b border-github-border-default bg-github-canvas-default'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
        <div className='py-3 flex flex-col sm:flex-row items-center justify-between gap-2'>
          <h1 className='text-xl font-[550] text-github-fg-default text-center sm:text-left'>
            {title}
          </h1>
          {children && (
            <div className='flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end'>
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

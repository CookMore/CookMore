'use client'

interface PageHeaderProps {
  title: string
  children?: React.ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className='border-b border-github-border-default bg-github-canvas-default'>
      <div className='px-4 py-3 flex items-center justify-between'>
        <h1 className='text-xl font-[550] text-github-fg-default'>{title}</h1>
        {children && <div className='flex items-center gap-2'>{children}</div>}
      </div>
    </header>
  )
}

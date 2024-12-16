import { IconX } from '@/app/api/icons'

interface BasePanelProps {
  title: string
  children: React.ReactNode
  onClose?: () => void
}

export function BasePanel({ title, children, onClose }: BasePanelProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between border-b border-github-border-default p-4'>
        <h2 className='text-sm font-semibold text-github-fg-default'>{title}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className='rounded p-1 text-github-fg-muted hover:bg-github-neutral-muted hover:text-github-fg-default'
          >
            <IconX className='h-4 w-4' />
          </button>
        )}
      </div>
      <div className='flex-1 overflow-auto p-4'>{children}</div>
    </div>
  )
}

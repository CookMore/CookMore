import { Icons } from '@/components/icons'

interface FormSectionHeaderProps {
  title: string
  description?: string
  required?: boolean
}

export function FormSectionHeader({ title, description, required }: FormSectionHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {required && (
          <Icons.lock className="h-4 w-4 text-github-danger-fg" />
        )}
      </div>
      {description && (
        <p className="mt-1 text-sm text-github-fg-muted">{description}</p>
      )}
    </div>
  )
}

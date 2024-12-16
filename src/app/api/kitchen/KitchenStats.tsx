'use client'

import { Icons } from '@/components/icons'
import { useKitchen } from '@/app/(authenticated)/kitchen/KitchenProvider'
import { LucideIcon } from 'lucide-react'

export function KitchenStats() {
  const { recipes, isLoading } = useKitchen()

  if (isLoading) {
    return (
      <div className='p-6 flex justify-center'>
        <Icons.spinner className='h-6 w-6 animate-spin' />
      </div>
    )
  }

  const stats = {
    total: recipes?.length ?? 0,
    published: recipes?.filter((r) => !r.isDraft).length ?? 0,
    drafts: recipes?.filter((r) => r.isDraft).length ?? 0,
    popular: recipes?.filter((r) => r.cookCount > 0).length ?? 0,
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6'>
      <StatCard title='Total Recipes' value={stats.total} icon={Icons.book} />
      <StatCard title='Published' value={stats.published} icon={Icons.check} />
      <StatCard title='In Progress' value={stats.drafts} icon={Icons.lock} />
      <StatCard title='Most Cooked' value={stats.popular} icon={Icons.heart} />
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: number
  icon: LucideIcon
}) {
  return (
    <div className='p-4 rounded-lg border border-github-border-default bg-github-canvas-subtle'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium text-github-fg-muted'>{title}</h3>
        <Icon className='h-4 w-4 text-github-fg-muted' />
      </div>
      <p className='mt-2 text-2xl font-semibold'>{value}</p>
    </div>
  )
}

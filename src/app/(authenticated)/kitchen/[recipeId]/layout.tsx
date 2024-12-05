'use client'

import React from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export default function RecipeLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const recipeId = params.recipeId as string

  const tabs = [
    { name: 'Overview', href: `/kitchen/${recipeId}` },
    { name: 'Edit', href: `/kitchen/${recipeId}/edit` },
    { name: 'Versions', href: `/kitchen/${recipeId}/versions` },
    { name: 'Issues', href: `/kitchen/${recipeId}/issues` },
  ]

  return (
    <div className='min-h-screen'>
      {/* Recipe Navigation */}
      <nav className='border-b border-github-border-default'>
        <div className='max-w-screen-xl mx-auto px-4'>
          <div className='flex space-x-8'>
            {tabs.map((tab) => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`py-4 px-2 border-b-2 ${
                    isActive
                      ? 'border-github-accent-fg text-github-accent-fg'
                      : 'border-transparent text-github-fg-muted hover:text-github-fg-default'
                  }`}
                >
                  {tab.name}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className='max-w-screen-xl mx-auto py-8 px-4'>{children}</main>
    </div>
  )
}

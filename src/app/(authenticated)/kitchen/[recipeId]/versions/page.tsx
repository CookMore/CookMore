'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { VersionHistory } from '@/components/kitchen/VersionHistory'
import { VersionCompare } from '@/components/kitchen/VersionCompare'
import { PageHeader } from '@/components/ui/PageHeader'

export default function RecipeVersionsPage() {
  const params = useParams()
  const recipeId = params.recipeId as string
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([])

  return (
    <div>
      <PageHeader title='Version History' />
      <div className='max-w-screen-xl mx-auto py-8 px-4'>
        <p className='text-github-fg-muted'>Track changes and updates to your recipe</p>

        {selectedVersions.length === 2 ? (
          <VersionCompare
            recipeId={recipeId}
            versions={selectedVersions}
            onClose={() => setSelectedVersions([])}
          />
        ) : (
          <VersionHistory
            recipeId={recipeId}
            onVersionSelect={(version) => {
              setSelectedVersions((prev) => (prev.length === 2 ? [version] : [...prev, version]))
            }}
          />
        )}
      </div>
    </div>
  )
}

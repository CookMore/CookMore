'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { VersionHistory } from '../../../../components/kitchen/VersionHistory'
import { VersionCompare } from '../../../../components/kitchen/VersionCompare'

export default function RecipeVersionsPage() {
  const params = useParams()
  const recipeId = params.recipeId as string
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([])

  return (
    <div className='max-w-screen-xl mx-auto py-8 px-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-github-fg-default'>Version History</h1>
        <p className='text-github-fg-muted'>Track changes and updates to your recipe</p>
      </div>

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
  )
}

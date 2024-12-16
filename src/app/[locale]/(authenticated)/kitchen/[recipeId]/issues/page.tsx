'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { IssueList } from '@/components/collaboration/IssueList'
import { NewIssueButton } from '@/components/kitchen/NewIssueButton'
import { PageHeader } from '@/components/ui/PageHeader'

export default function RecipeIssuesPage() {
  const params = useParams()
  const recipeId = params.recipeId as string

  return (
    <div>
      <PageHeader title='Recipe Issues'>
        <NewIssueButton recipeId={recipeId} />
      </PageHeader>
      <div className='max-w-screen-xl mx-auto py-8 px-4'>
        <p className='text-github-fg-muted'>Track problems and suggestions</p>
        <IssueList recipeId={recipeId} />
      </div>
    </div>
  )
}

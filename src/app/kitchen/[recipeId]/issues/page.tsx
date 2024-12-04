'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { IssueList } from '../../../../components/collaboration/IssueList'
import { NewIssueButton } from '../../../../components/kitchen/NewIssueButton'

export default function RecipeIssuesPage() {
  const params = useParams()
  const recipeId = params.recipeId as string

  return (
    <div className='max-w-screen-xl mx-auto py-8 px-4'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-github-fg-default'>Recipe Issues</h1>
          <p className='text-github-fg-muted'>Track problems and suggestions</p>
        </div>
        <NewIssueButton recipeId={recipeId} />
      </div>
      <IssueList recipeId={recipeId} />
    </div>
  )
}

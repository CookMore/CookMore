'use client'

import React from 'react'
import Link from 'next/link'

interface NewIssueButtonProps {
  recipeId: string
}

export function NewIssueButton({ recipeId }: NewIssueButtonProps) {
  return (
    <Link
      href={recipeId ? `/kitchen/${recipeId}/issues/new` : "#"}
      className='px-4 py-2 bg-github-success-emphasis text-white rounded-md hover:bg-github-success-emphasis/90'
    >
      New Issue
    </Link>
  )
}

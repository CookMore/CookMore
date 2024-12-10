'use client'

import { LanguageSelector } from './LanguageSelector'
import { LanguageSuggestion } from './LanguageSuggestion'

export function LanguageUI() {
  return (
    <>
      <div className='fixed top-4 right-4 z-50'>
        <LanguageSelector />
      </div>
      <LanguageSuggestion />
    </>
  )
}

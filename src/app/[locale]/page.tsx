'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function HomePage() {
  const params = useParams()
  console.log('🟡 [HomePage] Rendering with params:', params)

  let t
  try {
    t = useTranslations('common')
    console.log('🟢 [HomePage] Successfully loaded translations')
  } catch (error) {
    console.error('🔴 [HomePage] Failed to load translations:', error)
    return <div>Error loading translations</div>
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold mb-6'>{t('welcome')}</h1>
      <div className='text-sm text-gray-500'>Current locale: {params.locale}</div>
    </div>
  )
}

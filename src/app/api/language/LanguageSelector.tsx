'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Select } from '@/app/api/form/FormSelect'
import { locales, languages } from '@/i18n'

export function LanguageSelector() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const segments = pathname.split('/')
    const localeIndex = segments.findIndex((segment) => locales.includes(segment as any))
    if (localeIndex !== -1) {
      segments[localeIndex] = newLocale
      const newPath = segments.join('/')
      router.push(newPath)
    }
  }

  const options = Object.entries(languages).map(([code, name]) => ({
    value: code,
    label: name,
  }))

  return (
    <Select
      value={locale}
      onChange={handleLocaleChange}
      className='w-32'
      aria-label={t('language.select')}
      options={options}
    />
  )
}

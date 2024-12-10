'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Select } from '@/components/ui/form/FormSelect'
import { locales } from '@/config/i18n'

const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  hi: 'हिन्दी',
} as const

export function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    // Get the path segments
    const segments = pathname.split('/')
    // Find the locale segment index (should be the first segment after the empty string)
    const localeIndex = segments.findIndex((segment) => locales.includes(segment as any))
    if (localeIndex !== -1) {
      // Replace the locale segment
      segments[localeIndex] = newLocale
      const newPath = segments.join('/')
      router.push(newPath)
    }
  }

  return (
    <Select value={locale} onChange={handleLocaleChange} className='w-32'>
      {Object.entries(languages).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </Select>
  )
}

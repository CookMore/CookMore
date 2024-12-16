import { getRequestConfig } from 'next-intl/server'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import enCommon from '../public/messages/en/common.json'
import enProfile from '../public/messages/en/profile.json'
import esCommon from '../public/messages/es/common.json'
import frCommon from '../public/messages/fr/common.json'
import deCommon from '../public/messages/de/common.json'
import itCommon from '../public/messages/it/common.json'
import ptCommon from '../public/messages/pt/common.json'
import ruCommon from '../public/messages/ru/common.json'
import jaCommon from '../public/messages/ja/common.json'
import koCommon from '../public/messages/ko/common.json'
import zhCommon from '../public/messages/zh/common.json'

export const defaultLocale = 'en'
export const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']

export const languages = {
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

export const localePrefix = 'as-needed'

const messages = {
  en: {
    ...enCommon,
    profile: enProfile,
  },
  es: esCommon,
  fr: frCommon,
  de: deCommon,
  it: itCommon,
  pt: ptCommon,
  ru: ruCommon,
  ja: jaCommon,
  ko: koCommon,
  zh: zhCommon,
} as const

export async function getMessages(locale: string) {
  return messages[locale as keyof typeof messages] || messages.en
}

export default getRequestConfig(async ({ locale }) => ({
  messages: messages[locale as keyof typeof messages] || messages.en,
  timeZone: 'UTC',
  now: new Date(),
  formats: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
    },
  },
}))

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
})

import { getRequestConfig } from 'next-intl/server'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

// Import messages
import enCommon from '../public/messages/en/common.json'
import enProfile from '../public/messages/en/profile.json'
import enRecipe from '../public/messages/en/recipe.json'
import enPreview from '../public/messages/en/recipe.json'
import enMinting from '../public/messages/en/recipe.json'
import enMenu from '../public/messages/en/menu.json'

import esCommon from '../public/messages/es/common.json'
import frCommon from '../public/messages/fr/common.json'
import deCommon from '../public/messages/de/common.json'
import itCommon from '../public/messages/it/common.json'
import ptCommon from '../public/messages/pt/common.json'
import ruCommon from '../public/messages/ru/common.json'
import jaCommon from '../public/messages/ja/common.json'
import koCommon from '../public/messages/ko/common.json'
import zhCommon from '../public/messages/zh/common.json'

// Locale configuration
export const defaultLocale = 'en'
export const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'] as const
export type Locale = (typeof locales)[number]
export const localePrefix = 'as-needed'

// Language labels
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
} as const

// Messages configuration
const messages = {
  en: {
    ...enCommon,
    profile: enProfile,
    recipe: enRecipe,
    preview: enPreview,
    minting: enMinting,
    menu: enMenu,
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

// Next-intl configuration
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

// Navigation utilities
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
})

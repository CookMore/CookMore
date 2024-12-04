import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CookMore',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CookMore',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'CookMore',
    'apple-mobile-web-app-title': 'CookMore',
  },
}

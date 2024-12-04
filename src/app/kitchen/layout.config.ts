import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark light',
}

export const metadata: Metadata = {
  title: {
    template: '%s | CookMore Kitchen',
    default: 'Kitchen',
  },
  description: 'Manage and create your recipes in the kitchen',
}

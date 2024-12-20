import { unstable_setRequestLocale } from 'next-intl/server'

interface ProfileCreateLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function ProfileCreateLayout({ children, params }: ProfileCreateLayoutProps) {
  // Validate and set the locale
  const { locale } = await Promise.resolve(params)
  unstable_setRequestLocale(locale)

  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <div className='container mx-auto px-4 py-8'>{children}</div>
    </div>
  )
}

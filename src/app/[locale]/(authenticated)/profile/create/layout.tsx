import { unstable_setRequestLocale } from 'next-intl/server'

interface ProfileCreateLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function ProfileCreateLayout({ children, params }: ProfileCreateLayoutProps) {
  // Set the locale
  const { locale } = await params
  await unstable_setRequestLocale(locale)

  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <div className='container mx-auto'>{children}</div>
    </div>
  )
}

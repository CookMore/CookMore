import { unstable_setRequestLocale } from 'next-intl/server'

interface ProfileCreateLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function ProfileCreateLayout({
  children,
  params: { locale },
}: ProfileCreateLayoutProps) {
  unstable_setRequestLocale(locale)

  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <div className='w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='bg-github-canvas-default rounded-lg border border-github-border-default p-4 sm:p-6'>
          {children}
        </div>
      </div>
    </div>
  )
}

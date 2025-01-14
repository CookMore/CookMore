import { unstable_setRequestLocale } from 'next-intl/server'

interface RecipeCreateLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function NewRecipeLayout({ children, params }: RecipeCreateLayoutProps) {
  // Set the locale
  const { locale } = await params
  await unstable_setRequestLocale(locale)

  return (
    <div className='min-h-screen bg-github-canvas-default'>
      <div className='container mx-auto'>{children}</div>
    </div>
  )
}

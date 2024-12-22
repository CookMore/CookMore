import { unstable_setRequestLocale } from 'next-intl/server'
import { CreateProfileClient } from './CreateProfileClient'

interface CreateProfilePageProps {
  params: Promise<{ locale: string }>
}

export default async function CreateProfilePage({ params }: CreateProfilePageProps) {
  const { locale } = await params
  await unstable_setRequestLocale(locale)
  return <CreateProfileClient />
}

export async function generateMetadata({ params }: CreateProfilePageProps) {
  const { locale } = await params
  await unstable_setRequestLocale(locale)
  return {
    title: 'Create Profile',
  }
}

import { unstable_setRequestLocale } from 'next-intl/server'
import { CreateProfileClient } from './CreateProfileClient'
import { ProfileStepProvider } from '../ProfileStepContext'

interface CreateProfilePageProps {
  params: Promise<{ locale: string }>
}

export default async function CreateProfilePage({ params }: CreateProfilePageProps) {
  const { locale } = await params
  await unstable_setRequestLocale(locale)
  return (
    <ProfileStepProvider>
      <CreateProfileClient />
    </ProfileStepProvider>
  )
}

export async function generateMetadata({ params }: CreateProfilePageProps) {
  const { locale } = await params
  await unstable_setRequestLocale(locale)
  return {
    title: 'Create Profile',
  }
}

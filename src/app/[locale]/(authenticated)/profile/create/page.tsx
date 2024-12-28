import { unstable_setRequestLocale } from 'next-intl/server'
import { CreateProfileClient } from './CreateProfileClient'
import { ProfileStepProvider } from '../ProfileStepContext'

interface CreateProfilePageProps {
  params: Promise<{ locale: string }> | { locale: string }
}

export default async function CreateProfilePage({ params }: CreateProfilePageProps) {
  // Ensure params is resolved if it's a promise
  const { locale } = await Promise.resolve(params)

  // Ensure locale is handled asynchronously
  await unstable_setRequestLocale(locale)

  return (
    <ProfileStepProvider>
      <CreateProfileClient />
    </ProfileStepProvider>
  )
}

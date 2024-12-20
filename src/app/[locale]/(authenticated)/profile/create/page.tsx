import { unstable_setRequestLocale } from 'next-intl/server'
import { CreateProfileClient } from './CreateProfileClient'

interface CreateProfilePageProps {
  params: { locale: string }
}

export default async function CreateProfilePage({ params }: CreateProfilePageProps) {
  // Set the locale first
  await unstable_setRequestLocale(params.locale)

  console.log('Rendering CreateProfilePage')

  return (
    <div className='w-full'>
      <CreateProfileClient />
    </div>
  )
}

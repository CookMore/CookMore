import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getPrivyUser } from '@/app/api/auth/privy'
import type { AuthTokenClaims } from '@privy-io/server-auth'
import { ROUTES } from '@/app/api/routes/routes'
import { getProfile } from '@/app/[locale]/(authenticated)/profile/services/server/profile.service'
import { CreateProfileClient } from './CreateProfileClient'
import { CreateProfileSkeleton } from './CreateProfileSkeleton'
import { ErrorBoundary } from '@/app/[locale]/(authenticated)/profile/components/ErrorBoundary'
import { unstable_setRequestLocale } from 'next-intl/server'

// Extend AuthTokenClaims to include wallet property
interface PrivyUser extends AuthTokenClaims {
  wallet?: {
    address: string
  }
}

// Mark this component as a server component
export const dynamic = 'force-dynamic'

interface CreateProfilePageProps {
  params: { locale: string }
}

export default async function CreateProfilePage({ params: { locale } }: CreateProfilePageProps) {
  unstable_setRequestLocale(locale)

  console.log('Rendering CreateProfilePage')

  // Get the authenticated user
  const user = (await getPrivyUser()) as PrivyUser | null
  if (!user?.wallet?.address) {
    console.log('No authenticated user found, redirecting to marketing page')
    redirect(ROUTES.MARKETING.HOME)
  }

  // Check if user already has a profile
  const { data: existingProfile } = await getProfile(user.wallet.address)
  if (existingProfile) {
    console.log('User already has a profile, redirecting to profile page')
    redirect(ROUTES.AUTH.PROFILE.HOME)
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<CreateProfileSkeleton />}>
        <CreateProfileClient />
      </Suspense>
    </ErrorBoundary>
  )
}

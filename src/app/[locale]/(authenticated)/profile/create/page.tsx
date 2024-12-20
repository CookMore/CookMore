import { unstable_setRequestLocale } from 'next-intl/server'
import { CreateProfileClient } from './CreateProfileClient'
import { ProfileTier } from '../profile'
import { cookies } from 'next/headers'
import { headers } from 'next/headers'
import { ErrorFallback } from '../components/ui/ErrorFallback'
import { getProfile } from '../services/server/profile.service'
import { getPrivyUser } from '@/app/api/auth/privy'
import { Suspense } from 'react'
import { CreateProfileSkeleton } from './CreateProfileSkeleton'

interface CreateProfilePageProps {
  params: { locale: string }
}

export default async function CreateProfilePage({ params }: CreateProfilePageProps) {
  console.log('1. Starting page render')

  // Validate and set the locale
  const { locale } = await Promise.resolve(params)
  unstable_setRequestLocale(locale)
  console.log('2. Locale set:', locale)

  try {
    // Get user's wallet address from Privy token first
    const privyUser = await getPrivyUser()
    console.log('3. Privy user check:', {
      hasUser: !!privyUser,
      hasWallet: !!privyUser?.wallet,
      walletAddress: privyUser?.wallet?.address,
    })

    // Get user's wallet address from cookies or headers as fallback
    const [cookieStore, headersList] = await Promise.all([cookies(), headers()])
    const walletCookie = cookieStore.get('wallet-address')
    const walletHeader = await headersList.get('x-wallet-address')
    const userAddress =
      privyUser?.wallet?.address || walletCookie?.value || walletHeader || undefined

    console.log('4. Address check:', {
      privyAddress: privyUser?.wallet?.address,
      walletCookie: !!walletCookie,
      walletHeader: !!walletHeader,
      finalAddress: userAddress,
    })

    // If no address is available, return the loading state
    // The client component will handle the wallet connection
    if (!userAddress) {
      console.log('No wallet address found, returning loading state')
      return (
        <Suspense fallback={<CreateProfileSkeleton />}>
          <div className='w-full'>
            <CreateProfileClient
              initialTier={ProfileTier.FREE}
              tierFlags={{
                hasOG: false,
                hasGroup: false,
                hasPro: false,
              }}
            />
          </div>
        </Suspense>
      )
    }

    // Get profile data and tier status using the profile service
    console.log('5. Getting profile data for address:', userAddress)
    const profileResponse = await getProfile(userAddress)

    if (!profileResponse.success) {
      console.error('Failed to get profile data:', profileResponse.error)
      return (
        <ErrorFallback
          title='Something went wrong'
          message={profileResponse.error || 'Failed to get profile data'}
        />
      )
    }

    const { tierStatus } = profileResponse
    console.log('6. Profile data retrieved:', {
      userAddress,
      hasProfile: !!profileResponse.data,
      tierStatus,
    })

    // Set the wallet address cookie to maintain state
    cookieStore.set('wallet-address', userAddress, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    console.log('7. Rendering client component with tier:', tierStatus.currentTier)
    return (
      <Suspense fallback={<CreateProfileSkeleton />}>
        <div className='w-full'>
          <CreateProfileClient
            initialTier={tierStatus.currentTier}
            tierFlags={{
              hasOG: tierStatus.hasOG,
              hasGroup: tierStatus.hasGroup,
              hasPro: tierStatus.hasPro,
            }}
          />
        </div>
      </Suspense>
    )
  } catch (error) {
    console.error('Error in CreateProfilePage:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return (
      <ErrorFallback
        title='Something went wrong'
        message={error instanceof Error ? error.message : 'An unexpected error occurred'}
      />
    )
  }
}

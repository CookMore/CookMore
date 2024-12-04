import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { PrivyClient, AuthTokenClaims } from '@privy-io/server-auth'
import { profileStateService } from '@/lib/services/profile-state-service'
import type { ProfileMetadata, ProfileTier } from '@/types/profile'
import { validateProfile } from '@/lib/validations/profile'

interface LinkedAccount {
  type: string
  address: string
}

interface VerificationResponse extends AuthTokenClaims {
  linkedAccounts?: LinkedAccount[]
}

const privyClient = new PrivyClient(
  process.env.PRIVY_APP_SECRET!,
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!
)

// Define allowed methods
export const allowedMethods = ['POST']

// Helper to verify authentication
async function verifyAuth(request: NextRequest) {
  const privyTokenCookie = request.cookies.get('privy-token')
  if (!privyTokenCookie) {
    console.log('No privy-token cookie found')
    return { isAuthorized: false, error: 'No authentication token' }
  }

  try {
    // Verify token using Privy
    const verification = (await privyClient.verifyAuthToken(
      privyTokenCookie.value
    )) as VerificationResponse

    const walletAddress = verification.linkedAccounts?.find(
      (account) => account.type === 'wallet'
    )?.address

    if (!walletAddress) {
      return {
        isAuthorized: false,
        error: 'No wallet address found',
        shouldConnect: true,
      }
    }

    return {
      isAuthorized: true,
      walletAddress,
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return { isAuthorized: false, error: 'Invalid authentication token' }
  }
}

// Handle POST requests
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.isAuthorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const body = await request.json()
    console.log('Received profile data:', {
      tier: body.tier,
      walletAddress: auth.walletAddress,
      steps: body.steps,
    })

    // Validate profile data based on tier
    const validation = await validateProfile(body, body.tier as ProfileTier)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid profile data',
          details: validation.error,
        },
        { status: 400 }
      )
    }

    // Prepare metadata with tier-specific fields
    const { metadataUri, isValid } = await profileStateService.prepareMinting(
      {
        ...body,
        walletAddress: auth.walletAddress,
        tier: body.tier,
        version: '1.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ProfileMetadata,
      body.tier as ProfileTier
    )

    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Failed to prepare profile metadata',
        },
        { status: 400 }
      )
    }

    // Save profile data
    await profileStateService.saveDraft({
      ...body,
      metadataUri,
      walletAddress: auth.walletAddress,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...body,
        metadataUri,
        walletAddress: auth.walletAddress,
        createdAt: new Date().toISOString(),
      },
      walletAddress: auth.walletAddress,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

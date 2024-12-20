import { NextRequest, NextResponse } from 'next/server'
import { getPrivyUser } from '@/app/api/auth/privy'
import { getTierStatus } from '@/app/api/tiers/tiers'

export async function GET(request: NextRequest) {
  try {
    // Get the Privy token from the request
    const privyToken = request.cookies.get('privy-token')?.value

    if (!privyToken) {
      return NextResponse.json({ error: 'No authentication token found' }, { status: 401 })
    }

    // Get the user from Privy
    const privyUser = await getPrivyUser(privyToken)

    if (!privyUser?.wallet?.address) {
      return NextResponse.json({ error: 'No wallet address found' }, { status: 401 })
    }

    // Get the user's tier status
    const tierStatus = await getTierStatus(privyUser.wallet.address)

    console.log('Profile route check:', {
      walletAddress: privyUser.wallet.address,
      tierStatus,
    })

    return NextResponse.json({
      data: null, // We'll update this when we have profile data
      tierStatus,
    })
  } catch (error) {
    console.error('Profile route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

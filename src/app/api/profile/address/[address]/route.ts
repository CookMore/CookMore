import { NextRequest, NextResponse } from 'next/server'
import { getTierStatus } from '@/app/api/tiers/tiers'
import { getProfile } from '@/app/[locale]/(authenticated)/profile/services/server/profile.service'

export async function GET(request: NextRequest, context: { params: { address: string } }) {
  try {
    const { address } = context.params

    if (!address || !address.startsWith('0x')) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    console.log('Profile route check for address:', address)

    // Get profile data and tier status using the profile service
    const profileResponse = await getProfile(address)

    console.log('Profile response:', {
      success: profileResponse.success,
      hasProfile: !!profileResponse.data,
      tierStatus: profileResponse.tierStatus,
    })

    if (!profileResponse.success) {
      return NextResponse.json(
        {
          error: profileResponse.error || 'Failed to fetch profile',
          tierStatus: profileResponse.tierStatus,
          data: null,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: profileResponse.data,
      tierStatus: profileResponse.tierStatus,
    })
  } catch (error) {
    console.error('Profile route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

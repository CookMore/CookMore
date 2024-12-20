import { NextRequest, NextResponse } from 'next/server'
import { getProfile } from '@/app/[locale]/(authenticated)/profile/services/server/profile.service'

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params
    console.log('Profile route request:', {
      address,
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url,
      method: request.method,
    })

    if (!address || !address.startsWith('0x')) {
      console.log('Invalid address parameter:', address)
      return NextResponse.json({ error: 'Invalid address format' }, { status: 400 })
    }

    console.log('Fetching profile for address:', address)
    const result = await getProfile(address.toLowerCase())

    console.log('Profile fetch result:', {
      success: result.success,
      hasData: !!result.data,
      error: result.error,
      tierStatus: result.tierStatus,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch profile', walletAddress: address },
        { status: result.error ? 500 : 404 }
      )
    }

    return NextResponse.json({
      ...result,
      walletAddress: address,
    })
  } catch (error) {
    console.error('Error in profile API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

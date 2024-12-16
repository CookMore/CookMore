import { NextRequest, NextResponse } from 'next/server'
import { profileEdgeService } from '@/lib/services/profile/edge'

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address')
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    console.log('Fetching profile for address:', address)
    const result = await profileEdgeService.getProfile(address)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
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

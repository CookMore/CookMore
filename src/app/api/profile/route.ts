import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const walletAddress =
      req.headers.get('x-wallet-address') || new URL(req.url).searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Return empty profile for now
    return NextResponse.json({
      profile: null,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { walletAddress } = data

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      profile: {
        walletAddress,
        ...data,
      },
    })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}

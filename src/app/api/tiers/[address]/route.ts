import { NextRequest, NextResponse } from 'next/server'
import { getTierStatus } from '@/app/api/tiers/tiers'
import { serializeBigInt } from '@/app/api/blockchain/utils'
import type { TierStatus } from '@/app/[locale]/(authenticated)/profile/profile'

export async function GET(request: NextRequest, context: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await context.params

    if (!address || !address.startsWith('0x')) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    console.log('Tier check for address:', address)
    const tierStatus = await getTierStatus(address)

    // Ensure we have a valid tier status
    if (!tierStatus) {
      return NextResponse.json(
        {
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: 0,
        } as TierStatus,
        { status: 200 }
      )
    }

    // Serialize any BigInt values and ensure type safety
    const serializedStatus = serializeBigInt<TierStatus>(tierStatus)

    return NextResponse.json(serializedStatus)
  } catch (error) {
    console.error('Tier check error:', error)
    // Return a safe default state on error
    return NextResponse.json(
      {
        hasGroup: false,
        hasPro: false,
        hasOG: false,
        currentTier: 0,
      } as TierStatus,
      { status: 200 }
    )
  }
}

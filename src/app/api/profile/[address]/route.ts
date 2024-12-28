import { NextRequest, NextResponse } from 'next/server'
import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { profileABI } from '@/app/api/blockchain/abis'
import { getContractAddress } from '@/app/api/blockchain/utils/addresses'
import { getTierStatus } from '@/app/api/tiers/tiers'

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const { address } = params

    if (!address) {
      return NextResponse.json({ error: 'No address provided' }, { status: 400 })
    }

    console.log('Received request for address:', address)

    const contract = (await getServerContract({
      address: getContractAddress('PROFILE_REGISTRY'),
      abi: profileABI,
    })) as any
    console.log('Contract fetched:', contract)

    if (!contract?.read) {
      console.error('Contract or read methods not available')
      return NextResponse.json(
        {
          success: true,
          data: null,
          tierStatus: {
            hasGroup: false,
            hasPro: false,
            hasOG: false,
            currentTier: 0,
          },
        },
        { status: 200 }
      )
    }

    // Check if profile exists in contract
    let profileId
    try {
      profileId = await contract.read.getProfileId([address])
      console.log('Profile ID check:', {
        profileId: profileId?.toString(),
        address,
      })
    } catch (error) {
      console.error('Error reading profile ID:', error)
      return NextResponse.json(
        {
          success: true,
          data: null,
          tierStatus: {
            hasGroup: false,
            hasPro: false,
            hasOG: false,
            currentTier: 0,
          },
        },
        { status: 200 }
      )
    }

    const exists = profileId > 0n
    console.log('Profile exists:', exists)

    // Get the user's tier status
    const tierStatus = await getTierStatus(address)
    console.log('Tier status:', tierStatus)

    if (!exists) {
      console.log('No valid profile found for address:', address)
      return NextResponse.json(
        {
          success: true,
          data: null,
          tierStatus,
        },
        { status: 200 }
      )
    }

    // Verify the profile by checking if it has valid metadata
    let metadataURI
    try {
      metadataURI = await contract.read.tokenURI([profileId])
      console.log('Metadata URI:', metadataURI)
    } catch (error) {
      console.error('Failed to get metadata URI:', error)
      return NextResponse.json(
        {
          success: true,
          data: {
            exists: true,
            wallet: address,
            metadataURI: null,
            tier: tierStatus.currentTier,
          },
          tierStatus,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          exists: true,
          wallet: address,
          metadataURI,
          tier: tierStatus.currentTier,
        },
        tierStatus,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile route error:', error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Internal server error',
        tierStatus: {
          hasGroup: false,
          hasPro: false,
          hasOG: false,
          currentTier: 0,
        },
      },
      { status: 500 }
    )
  }
}

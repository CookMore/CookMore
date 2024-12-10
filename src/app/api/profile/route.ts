import { NextResponse } from 'next/server'
import { getProfileRegistryContract } from '@/lib/web3/contracts'
import { ipfsService } from '@/lib/services/ipfs-service'
import { isValidAddress } from '@/lib/web3/addresses'

export async function GET(request: Request) {
  try {
    // Get the user's address from the request
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    // Validate address presence and format
    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address parameter is required' },
        { status: 400 }
      )
    }

    if (!isValidAddress(address)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Ethereum address format' },
        { status: 400 }
      )
    }

    // Get contract instance with error handling
    let contract
    try {
      contract = await getProfileRegistryContract()
    } catch (error) {
      console.error('Error getting contract instance:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to connect to blockchain network',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 503 }
      )
    }

    // Get profile with error handling
    let profile
    try {
      profile = await contract.getProfile(address)
    } catch (error) {
      console.error('Error fetching profile from contract:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch profile from blockchain',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 502 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profile not found',
          details: `No profile exists for address ${address}`,
        },
        { status: 404 }
      )
    }

    // Fetch metadata from IPFS if available
    let metadata = null
    if (profile.metadataURI) {
      try {
        metadata = await ipfsService.getProfileMetadata(profile.metadataURI)
      } catch (error) {
        console.error('Error fetching IPFS metadata:', error)
        // Log but don't fail the request, continue with null metadata
        metadata = null
      }
    }

    // Validate and normalize profile data
    const normalizedType = profile.type?.toLowerCase() || 'free'
    if (!['free', 'pro', 'group'].includes(normalizedType)) {
      console.warn(`Invalid profile type: ${profile.type}, defaulting to 'free'`)
    }

    // Convert BigInt values to strings and ensure consistent response structure
    const serializedProfile = {
      success: true,
      data: {
        id: profile.id?.toString() || '',
        address: profile.address || address,
        type: ['free', 'pro', 'group'].includes(normalizedType) ? normalizedType : 'free',
        metadata: metadata || profile.metadata || {},
        createdAt: profile.createdAt?.toString() || '',
        updatedAt: profile.updatedAt?.toString() || '',
      },
    }

    // Set cache headers
    const headers = new Headers({
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
    })

    return NextResponse.json(serializedProfile, { headers })
  } catch (error) {
    console.error('Unexpected error in profile endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  })
}

import { NextResponse } from 'next/server'
import { isValidAddress } from '@/lib/web3/config/chains'
import { fetchFromIpfs } from '@/lib/web3/config/ipfs'
import { publicClient } from '@/lib/web3/config/client'
import { PROFILE_REGISTRY_ABI } from '@/lib/web3/abis'
import { getAddresses } from '@/lib/web3/utils/addresses'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    // Get the user's address from the request
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    console.log('Profile request for address:', address)

    // Validate address presence and format
    if (!address) {
      console.log('No address provided')
      return NextResponse.json(
        { success: false, error: 'Address parameter is required' },
        { status: 400 }
      )
    }

    if (!isValidAddress(address)) {
      console.log('Invalid address format:', address)
      return NextResponse.json(
        { success: false, error: 'Invalid Ethereum address format' },
        { status: 400 }
      )
    }

    // Get contract address
    const addresses = getAddresses()
    const contractAddress = addresses.PROFILE_REGISTRY

    // First check if the address has a profile
    let hasProfile
    try {
      hasProfile = await publicClient.readContract({
        address: contractAddress,
        abi: PROFILE_REGISTRY_ABI,
        functionName: 'hasProfile',
        args: [address as `0x${string}`],
      })
      console.log('Has profile:', hasProfile)

      if (!hasProfile) {
        return NextResponse.json(
          {
            success: false,
            error: 'Profile not found',
            details: `No profile exists for address ${address}`,
          },
          { status: 404 }
        )
      }
    } catch (error) {
      console.error('Contract read error (hasProfile):', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to check profile existence',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 502 }
      )
    }

    // Get profile with error handling
    let profile
    try {
      console.log('Fetching profile from contract...')
      profile = await publicClient.readContract({
        address: contractAddress,
        abi: PROFILE_REGISTRY_ABI,
        functionName: 'getProfile',
        args: [address as `0x${string}`],
      })
      console.log('Profile fetched:', profile)
    } catch (error) {
      console.error('Contract read error (getProfile):', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch profile from blockchain',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 502 }
      )
    }

    // Fetch metadata from IPFS if available
    let metadata = null
    if (profile.metadataURI) {
      try {
        console.log('Fetching IPFS metadata from:', profile.metadataURI)
        metadata = await fetchFromIpfs(profile.metadataURI)
        console.log('IPFS metadata fetched:', !!metadata)
      } catch (error) {
        console.error('IPFS metadata fetch error:', error)
        // Log but don't fail the request, continue with null metadata
        metadata = null
      }
    }

    // Map tier number to string
    const tierMap = {
      0: 'free',
      1: 'pro',
      2: 'group',
    } as const

    // Convert BigInt values to strings and ensure consistent response structure
    const serializedProfile = {
      success: true,
      data: {
        id: profile.profileId?.toString() || '',
        address: profile.wallet || address,
        type: tierMap[profile.tier as keyof typeof tierMap] || 'free',
        metadata: metadata || {},
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
      },
    }

    console.log('Returning serialized profile:', JSON.stringify(serializedProfile, null, 2))

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

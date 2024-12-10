import { NextResponse } from 'next/server'
import { getProfileRegistryContract } from '@/lib/web3/contracts'
import { ipfsService } from '@/lib/services/ipfs-service'

export async function GET(request: Request, context: { params: { address: string } }) {
  try {
    const params = await context.params
    const address = params.address

    if (!address) {
      return NextResponse.json({ success: false, error: 'Address is required' }, { status: 400 })
    }

    const contract = await getProfileRegistryContract()
    const profile = await contract.getProfile(address)

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })
    }

    // Fetch metadata from IPFS if available
    let metadata = null
    if (profile.metadataURI) {
      try {
        metadata = await ipfsService.getProfileMetadata(profile.metadataURI)
      } catch (error) {
        console.error('Error fetching IPFS metadata:', error)
        // Continue with null metadata if IPFS fetch fails
      }
    }

    // Convert BigInt values to strings and ensure consistent response structure
    const serializedProfile = {
      success: true,
      data: {
        id: profile.id?.toString() || '',
        address: profile.address || address,
        type: profile.type || 'free',
        metadata: metadata || profile.metadata || {},
        createdAt: profile.createdAt?.toString() || '',
        updatedAt: profile.updatedAt?.toString() || '',
      },
    }

    return NextResponse.json(serializedProfile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
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
    },
  })
}

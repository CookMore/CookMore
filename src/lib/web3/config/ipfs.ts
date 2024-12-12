import { create } from 'ipfs-http-client'

// Environment configuration
const IPFS_CONFIG = {
  pinata: {
    jwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
    host: 'api.pinata.cloud',
    port: 443,
    protocol: 'https',
  },
} as const

// Create Pinata client if JWT exists
export const pinataIpfsClient = IPFS_CONFIG.pinata.jwt
  ? create({
      host: IPFS_CONFIG.pinata.host,
      port: IPFS_CONFIG.pinata.port,
      protocol: IPFS_CONFIG.pinata.protocol,
      headers: {
        authorization: `Bearer ${IPFS_CONFIG.pinata.jwt}`,
      },
    })
  : null

// Default to Pinata client
export const ipfsClient = pinataIpfsClient

// Gateway URLs
export const IPFS_GATEWAYS = {
  pinata: 'https://gateway.pinata.cloud/ipfs',
  ipfs: 'https://ipfs.io/ipfs',
} as const

// Types
export type IpfsGateway = keyof typeof IPFS_GATEWAYS

// Helper to get gateway URL
export const getIpfsUrl = (cid: string, gateway: IpfsGateway = 'pinata') => {
  if (!cid) return ''
  const cleanCid = cid.replace('ipfs://', '')
  return `${IPFS_GATEWAYS[gateway]}/${cleanCid}`
}

// Helper to fetch IPFS content
export async function fetchFromIpfs(cid: string, gateway: IpfsGateway = 'pinata') {
  if (!cid) throw new Error('No CID provided')
  const url = getIpfsUrl(cid, gateway)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch from IPFS: ${response.status}`)
  }
  return response.json()
}

if (!ipfsClient) {
  console.warn('No IPFS client configured. Please check your environment variables.')
}

export { IPFS_CONFIG }

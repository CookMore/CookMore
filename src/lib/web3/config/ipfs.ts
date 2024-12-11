import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

// Environment configuration
const IPFS_CONFIG = {
  infura: {
    projectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
    apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_INFURA_API_SECRET,
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  },
  pinata: {
    jwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
    host: 'api.pinata.cloud',
    port: 443,
    protocol: 'https',
  },
} as const

// Create Infura client if credentials exist
const infuraAuth = IPFS_CONFIG.infura.projectId && IPFS_CONFIG.infura.apiSecret
  ? 'Basic ' + Buffer.from(IPFS_CONFIG.infura.projectId + ':' + IPFS_CONFIG.infura.apiSecret).toString('base64')
  : undefined

export const infuraIpfsClient = infuraAuth ? create({
  host: IPFS_CONFIG.infura.host,
  port: IPFS_CONFIG.infura.port,
  protocol: IPFS_CONFIG.infura.protocol,
  headers: {
    authorization: infuraAuth,
  },
}) : null

// Create Pinata client if JWT exists
export const pinataIpfsClient = IPFS_CONFIG.pinata.jwt ? create({
  host: IPFS_CONFIG.pinata.host,
  port: IPFS_CONFIG.pinata.port,
  protocol: IPFS_CONFIG.pinata.protocol,
  headers: {
    authorization: `Bearer ${IPFS_CONFIG.pinata.jwt}`,
  },
}) : null

// Default to Pinata, fallback to Infura
export const ipfsClient = pinataIpfsClient || infuraIpfsClient

// Gateway URLs
export const IPFS_GATEWAYS = {
  infura: 'https://cookmore.infura-ipfs.io/ipfs',
  pinata: 'https://gateway.pinata.cloud/ipfs',
  ipfs: 'https://ipfs.io/ipfs',
} as const

// Types
export type IpfsGateway = keyof typeof IPFS_GATEWAYS

// Helper to get gateway URL
export const getIpfsUrl = (cid: string, gateway: IpfsGateway = 'pinata') => {
  return `${IPFS_GATEWAYS[gateway]}/${cid}`
}

if (!ipfsClient) {
  console.warn('No IPFS client configured. Please check your environment variables.')
}

export { IPFS_CONFIG }

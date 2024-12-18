'use client'

import { create } from 'ipfs-http-client'

export const ipfsConfig = {
  host: process.env.NEXT_PUBLIC_IPFS_HOST,
  port: Number(process.env.NEXT_PUBLIC_IPFS_PORT),
  protocol: process.env.NEXT_PUBLIC_IPFS_PROTOCOL,
}

// Only create client on browser
export const createIpfsClient = () => {
  if (typeof window === 'undefined') return null
  return create(ipfsConfig)
}

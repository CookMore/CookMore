import { create } from 'ipfs-http-client'
import CryptoJS from 'crypto-js'

// Ensure environment variables are set
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET

if (!PINATA_JWT || !PINATA_API_KEY || !PINATA_API_SECRET) {
  throw new Error('Pinata credentials are not set in the environment variables.')
}

// Configure the IPFS client to use Pinata
const ipfs = create({
  host: 'api.pinata.cloud',
  port: 443,
  protocol: 'https',
  headers: {
    Authorization: `Bearer ${PINATA_JWT}`,
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_API_SECRET,
  },
})

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''

if (!ENCRYPTION_KEY) {
  console.warn('ENCRYPTION_KEY is not set in the environment variables.')
}

export async function uploadToIPFS(data: object): Promise<string> {
  try {
    const { cid } = await ipfs.add(JSON.stringify(data))
    return cid.toString()
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error('Failed to upload to IPFS')
  }
}

export function encryptData(data: object): string {
  const stringifiedData = JSON.stringify(data)
  const encryptedData = CryptoJS.AES.encrypt(stringifiedData, ENCRYPTION_KEY).toString()
  return encryptedData
}

export function decryptData(encryptedData: string): object {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decryptedData)
}

export async function uploadEncryptedDataToIPFS(data: object): Promise<string> {
  const encryptedData = encryptData(data)
  const { cid } = await ipfs.add(encryptedData)
  return cid.toString()
}

export async function fetchAndDecryptDataFromIPFS(cid: string): Promise<object> {
  const stream = ipfs.cat(cid)
  let data = ''
  for await (const chunk of stream) {
    data += chunk.toString()
  }
  return decryptData(data)
}

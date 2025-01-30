import { create } from 'ipfs-http-client'
import crypto from 'crypto'

const IPFS_API_URL = process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001/api/v0'
const ENCRYPTION_KEY_HEX = process.env.ENCRYPTION_KEY || ''

export async function encryptAndUploadToIPFS(data: object): Promise<string> {
  if (!ENCRYPTION_KEY_HEX) throw new Error('Missing ENCRYPTION_KEY in .env')

  const keyBuffer = Buffer.from(ENCRYPTION_KEY_HEX, 'hex')
  if (keyBuffer.length !== 32) throw new Error('ENCRYPTION_KEY must be 32 bytes in hex.')

  const jsonString = JSON.stringify(data)
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv)
  let encrypted = cipher.update(jsonString, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  const authTag = cipher.getAuthTag()

  const encryptedPayload = {
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: encrypted,
  }

  const client = create({ url: IPFS_API_URL })
  const { cid } = await client.add(JSON.stringify(encryptedPayload))

  return cid.toString()
}

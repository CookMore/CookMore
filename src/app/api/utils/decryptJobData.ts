// utils/decryptJobData.ts
import crypto from 'crypto'

export interface EncryptedPayload {
  iv: string // base64
  authTag: string // base64
  ciphertext: string // base64
}

export interface PrivateJobFields {
  employerName: string
  compensation: string
  contactInformation: string
}

/**
 * Decrypts the given EncryptedPayload (AES-256-GCM).
 * `encryptionKeyHex` is the same 256-bit key in hex form.
 */
export function decryptJobData(
  encryptedPayload: EncryptedPayload,
  encryptionKeyHex: string
): PrivateJobFields {
  const keyBuffer = Buffer.from(encryptionKeyHex, 'hex')

  const iv = Buffer.from(encryptedPayload.iv, 'base64')
  const authTag = Buffer.from(encryptedPayload.authTag, 'base64')
  const ciphertext = encryptedPayload.ciphertext

  const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return JSON.parse(decrypted)
}

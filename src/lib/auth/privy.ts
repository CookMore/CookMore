import { headers } from 'next/headers'
import { PrivyClient } from '@privy-io/server-auth'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error('Missing required Privy environment variables')
}

const privyClient = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET)

export async function getPrivyUser() {
  try {
    const headersList = headers()
    const authHeader = headersList.get('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split(' ')[1]
    const verifiedUser = await privyClient.verifyAuthToken(token)

    return verifiedUser
  } catch (error) {
    console.error('Error verifying Privy auth token:', error)
    return null
  }
}

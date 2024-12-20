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
    const headersList = await headers()
    const authHeader = await headersList.get('authorization')

    console.log('getPrivyUser headers:', {
      hasAuthHeader: !!authHeader,
      authHeaderStart: authHeader?.substring(0, 20),
      allHeaders: Object.fromEntries(headersList.entries()),
    })

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No Bearer token found in authorization header')
      return null
    }

    const token = authHeader.split(' ')[1]
    console.log('Verifying token:', {
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20),
    })

    const verifiedUser = await privyClient.verifyAuthToken(token)
    console.log('User verified:', {
      hasUser: !!verifiedUser,
      userId: verifiedUser?.sub,
      hasWallet: !!verifiedUser?.wallet,
    })

    return verifiedUser
  } catch (error) {
    console.error('Error verifying Privy auth token:', error)
    return null
  }
}

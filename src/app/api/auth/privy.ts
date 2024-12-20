import { headers, cookies } from 'next/headers'
import { PrivyClient } from '@privy-io/server-auth'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error('Missing required Privy environment variables')
}

const privyClient = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET)

export async function getPrivyUser() {
  try {
    const cookieStore = await cookies()
    const privyToken = await cookieStore.get('privy-token')

    console.log('getPrivyUser cookies:', {
      hasPrivyToken: !!privyToken,
      tokenLength: privyToken?.value?.length,
      tokenStart: privyToken?.value?.substring(0, 20),
    })

    if (!privyToken?.value) {
      console.log('No Privy token found in cookies')
      return null
    }

    console.log('Verifying token:', {
      tokenLength: privyToken.value.length,
      tokenStart: privyToken.value.substring(0, 20),
    })

    const verifiedUser = await privyClient.verifyAuthToken(privyToken.value)

    if (!verifiedUser?.sub) {
      console.log('No user ID found in verified token')
      return null
    }

    try {
      // Get user's wallet information
      const userWallets = await privyClient.getUser(verifiedUser.sub)
      const walletAddress = userWallets?.wallet?.address

      console.log('User verified:', {
        hasUser: !!verifiedUser,
        userId: verifiedUser.sub,
        hasWallet: !!walletAddress,
        walletAddress,
      })

      return {
        ...verifiedUser,
        wallet: userWallets?.wallet,
      }
    } catch (walletError) {
      console.error('Error fetching user wallet:', walletError)
      // Return the verified user even if wallet fetch fails
      return verifiedUser
    }
  } catch (error) {
    console.error('Error verifying Privy auth token:', error)
    return null
  }
}

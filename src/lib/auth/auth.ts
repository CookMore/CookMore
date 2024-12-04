import { PrivyClient, AuthTokenClaims } from '@privy-io/server-auth'

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not defined')
}

if (!process.env.PRIVY_APP_SECRET) {
  throw new Error('PRIVY_APP_SECRET is not defined')
}

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  process.env.PRIVY_APP_SECRET
)

interface VerifiedUser extends AuthTokenClaims {
  wallet?: {
    address: string
  } | null
}

export async function getToken(token: string) {
  try {
    console.log('Starting token verification...', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 10),
    })

    if (!token) {
      throw new Error('Token is empty')
    }

    const verifiedUser = (await privyClient.verifyAuthToken(token)) as VerifiedUser

    console.log('User verification state:', {
      subject: verifiedUser?.sub,
      hasWallet: !!verifiedUser?.wallet,
      walletAddress: verifiedUser?.wallet?.address?.substring(0, 6),
    })

    if (!verifiedUser) {
      throw new Error('Verification returned no user')
    }

    const walletAddress = verifiedUser.wallet?.address

    if (!walletAddress) {
      console.log('No wallet address found in verified user')
      return {
        ...verifiedUser,
        wallet: null,
      }
    }

    return {
      ...verifiedUser,
      wallet: { address: walletAddress },
    }
  } catch (error) {
    console.error('Token verification error:', {
      error,
      message: error.message,
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 10),
    })
    throw new Error('Invalid token: ' + error.message)
  }
}

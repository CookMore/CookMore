import { redirect } from 'next/navigation'
import { getPrivyUser } from '@/app/api/auth/privy'
import { getContracts } from '@/app/api/blockchain/server/getContracts'
import { ROUTES } from '@/app/api/routes/routes'
import { ProfileTier } from '../../profile'
import { CreateProfileClient } from './CreateProfileClient'

export default async function CreateProfilePage() {
  // Get authenticated user
  const user = await getPrivyUser()
  if (!user) {
    redirect(ROUTES.AUTH.LOGIN)
  }

  // Get contracts
  const { tierContract, profileContract } = await getContracts()

  // Check if user already has a profile
  const profile = await profileContract.getProfile(user.wallet.address)
  if (profile.exists) {
    redirect(ROUTES.AUTH.PROFILE.ROOT)
  }

  // Check user's tier status
  const hasPro = (await tierContract.balanceOf(user.wallet.address, ProfileTier.PRO)) > 0
  const hasGroup = (await tierContract.balanceOf(user.wallet.address, ProfileTier.GROUP)) > 0

  // If no tier selected yet, redirect to tier selection
  const currentTier = hasGroup ? ProfileTier.GROUP : hasPro ? ProfileTier.PRO : ProfileTier.FREE

  // Pass tier info to client component
  return <CreateProfileClient initialTier={currentTier} userAddress={user.wallet.address} />
}

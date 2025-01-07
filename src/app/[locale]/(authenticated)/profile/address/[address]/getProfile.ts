import type { NextApiRequest, NextApiResponse } from 'next'
import { getProfile } from '@/app/[locale]/(authenticated)/profile/services/server/profile.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, network } = req.query

  if (typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid address' })
  }

  if (network !== 'mainnet' && network !== 'sepolia') {
    return res.status(400).json({ error: 'Invalid network' })
  }

  try {
    const profileData = await getProfile(address, network as 'mainnet' | 'sepolia')
    res.status(200).json(profileData)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile data' })
  }
}

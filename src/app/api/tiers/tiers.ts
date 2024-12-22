import { IconChefHat, IconStar, IconBuilding, IconCrown } from '@/app/api/icons'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { getServerContract } from '@/app/api/blockchain/server/getContracts'
import { CONTRACTS } from '@/app/api/blockchain/config/contracts'
import type { Address } from 'viem'

// Create public clients for both networks
const publicClients = {
  testnet: createPublicClient({
    chain: baseSepolia,
    transport: http(),
  }),
  mainnet: createPublicClient({
    chain: base,
    transport: http(),
  }),
}

// Get the appropriate client based on environment
const getPublicClient = () => {
  return process.env.NEXT_PUBLIC_NETWORK_ENV === 'mainnet'
    ? publicClients.mainnet
    : publicClients.testnet
}

// Define the minimal ERC721 functions we need
const minimalERC721ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenTier',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const

// Export tier information
export const tierInfo = {
  [ProfileTier.FREE]: {
    title: 'Free',
    description: 'Perfect for home cooks',
    price: '$0',
    features: [
      'Unlimited public recipes',
      'Basic recipe versioning',
      'Community features',
      '$1 platform fee per Recipe NFT minted',
    ],
    limitations: [
      'Limited to 5 recipes per month',
      'Basic analytics only',
      'No custom branding',
      'Community support only',
    ],
  },
  [ProfileTier.PRO]: {
    title: 'Pro',
    description: 'For serious chefs',
    price: '$25 USDC',
    features: [
      'Soul Bound Token',
      'No platform fees',
      'Advanced recipe features',
      'Priority support',
      'Early access to new features',
      'Custom profile branding',
    ],
  },
  [ProfileTier.GROUP]: {
    title: 'Group',
    description: 'For teams & restaurants',
    price: '$100 USDC',
    features: [
      'All Pro features',
      'Team collaboration',
      'Analytics dashboard',
      'Custom branding',
      'API access',
      'Dedicated support',
    ],
  },
  [ProfileTier.OG]: {
    title: 'OG',
    description: 'Limited edition for early adopters',
    price: '$150 USDC',
    features: [
      'All Group features',
      'Lifetime platform fee waiver',
      'Exclusive OG badge',
      'Early access to all features',
      'Priority feature requests',
      'Direct access to dev team',
      'Limited to first 500 members',
    ],
  },
}

export const tierStyles = {
  [ProfileTier.FREE]: {
    borderColor: 'border-github-border-default',
    bgColor: 'bg-github-canvas-default',
    color: 'text-github-fg-default',
    iconBg: 'bg-github-canvas-subtle',
    badgeColor: 'bg-github-fg-muted',
    icon: IconChefHat,
  },
  [ProfileTier.PRO]: {
    borderColor: 'border-github-accent-emphasis',
    bgColor: 'bg-github-accent-subtle',
    color: 'text-github-accent-fg',
    iconBg: 'bg-github-accent-muted',
    badgeColor: 'bg-github-accent-emphasis',
    icon: IconStar,
  },
  [ProfileTier.GROUP]: {
    borderColor: 'border-github-success-emphasis',
    bgColor: 'bg-github-success-subtle',
    color: 'text-github-success-fg',
    iconBg: 'bg-github-success-muted',
    badgeColor: 'bg-github-success-emphasis',
    icon: IconBuilding,
  },
  [ProfileTier.OG]: {
    borderColor: 'border-github-done-emphasis',
    bgColor: 'bg-github-done-subtle',
    color: 'text-github-done-fg',
    iconBg: 'bg-github-done-muted',
    badgeColor: 'bg-github-done-emphasis',
    icon: IconCrown,
  },
}

// Helper function to get icon component
export const getIconComponent = (iconType: 'chef' | 'star' | 'building' | 'crown') => {
  switch (iconType) {
    case 'chef':
      return IconChefHat
    case 'star':
      return IconStar
    case 'building':
      return IconBuilding
    case 'crown':
      return IconCrown
  }
}

// Contract addresses
export const TIER_CONTRACT_ADDRESS = '0x947b40801581E896C29dD73f9C7f5dd710877b64' as const

// Helper to get tier info with styling
export const getTierInfo = (tier: ProfileTier) => {
  return {
    ...tierInfo[tier],
    ...tierStyles[tier],
  }
}

// Helper to check if tier is paid
export const isPaidTier = (tier: ProfileTier) => {
  return tier !== ProfileTier.FREE
}

// Helper to get next tier
export const getNextTier = (currentTier: ProfileTier): ProfileTier | null => {
  switch (currentTier) {
    case ProfileTier.FREE:
      return ProfileTier.PRO
    case ProfileTier.PRO:
      return ProfileTier.GROUP
    case ProfileTier.GROUP:
      return ProfileTier.OG
    default:
      return null
  }
}

// Helper to get tier requirements
export const getTierRequirements = (tier: ProfileTier) => {
  switch (tier) {
    case ProfileTier.PRO:
      return {
        minRecipes: 5,
        minFollowers: 100,
        minRating: 4.5,
      }
    case ProfileTier.GROUP:
      return {
        minRecipes: 20,
        minFollowers: 1000,
        minRating: 4.8,
        requiresVerification: true,
      }
    case ProfileTier.OG:
      return {
        minRecipes: 50,
        minFollowers: 5000,
        minRating: 4.9,
        requiresVerification: true,
        requiresInvitation: true,
      }
    default:
      return null
  }
}

// Function to get user's tier status
export async function getTierStatus(address: string) {
  try {
    console.log('Checking tier status for address:', address)

    const publicClient = getPublicClient()
    const contract = await getServerContract({
      address: CONTRACTS.TIER as Address,
      abi: minimalERC721ABI,
    })

    // Get balance first
    const balance = await publicClient.readContract({
      ...contract,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })

    console.log('Balance check:', balance.toString())

    if (balance === 0n) {
      return {
        hasGroup: false,
        hasPro: false,
        hasOG: false,
        currentTier: ProfileTier.FREE,
      }
    }

    // Get all Transfer events (both in and out)
    const [transfersIn, transfersOut] = await Promise.all([
      // Get transfers TO this address
      publicClient.getLogs({
        address: contract.address,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: true, name: 'tokenId', type: 'uint256' },
          ],
        },
        args: {
          to: address as `0x${string}`,
        },
        fromBlock: 'earliest',
      }),
      // Get transfers FROM this address
      publicClient.getLogs({
        address: contract.address,
        event: {
          type: 'event',
          name: 'Transfer',
          inputs: [
            { indexed: true, name: 'from', type: 'address' },
            { indexed: true, name: 'to', type: 'address' },
            { indexed: true, name: 'tokenId', type: 'uint256' },
          ],
        },
        args: {
          from: address as `0x${string}`,
        },
        fromBlock: 'earliest',
      }),
    ])

    console.log('Found transfer events:', {
      transfersIn: transfersIn.length,
      transfersOut: transfersOut.length,
    })

    // Track currently owned tokens
    const ownedTokens = new Set<bigint>()

    // Add tokens transferred in
    transfersIn.forEach((log) => {
      ownedTokens.add(log.args.tokenId)
    })

    // Remove tokens transferred out
    transfersOut.forEach((log) => {
      ownedTokens.delete(log.args.tokenId)
    })

    let hasGroup = false
    let hasPro = false
    let hasOG = false
    let currentTier = ProfileTier.FREE

    // Check tier for currently owned tokens
    for (const tokenId of ownedTokens) {
      try {
        const tierType = await publicClient.readContract({
          ...contract,
          functionName: 'tokenTier',
          args: [tokenId],
        })

        console.log(`Token ${tokenId} tier:`, tierType)

        // Update tier flags based on the token tier
        if (tierType === 'Group') {
          hasGroup = true
          if (currentTier < ProfileTier.GROUP) {
            currentTier = ProfileTier.GROUP
          }
        } else if (tierType === 'Pro') {
          hasPro = true
          if (currentTier < ProfileTier.PRO) {
            currentTier = ProfileTier.PRO
          }
        } else if (tierType === 'OG') {
          hasOG = true
          currentTier = ProfileTier.OG
        }
      } catch (error) {
        console.error(`Error reading tier for token ${tokenId}:`, error)
      }
    }

    console.log('Final tier status:', {
      hasOG,
      hasGroup,
      hasPro,
      currentTier,
    })

    return {
      hasGroup,
      hasPro,
      hasOG,
      currentTier,
    }
  } catch (error) {
    console.error('Error getting tier status:', error)
    return {
      hasGroup: false,
      hasPro: false,
      hasOG: false,
      currentTier: ProfileTier.FREE,
    }
  }
}

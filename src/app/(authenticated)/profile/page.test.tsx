import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom'
import ProfilePage from './page'
import { useProfile } from '@/hooks/useProfile'
import { ProfileTier } from '@/types/profile'

// Define types for Image props
interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  unoptimized?: boolean
}

// Mock next/image at the test level
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt, ...props }: ImageProps) {
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock the hooks
jest.mock('@privy-io/react-auth', () => ({
  usePrivy: () => ({
    user: null,
    authenticated: false,
    ready: true,
  }),
}))

jest.mock('@/hooks/useProfile')

describe('ProfilePage', () => {
  beforeEach(() => {
    // Mock implementation for Pro tier
    ;(useProfile as jest.Mock).mockImplementation(() => ({
      currentTier: ProfileTier.PRO,
      canAccessTier: (tier: ProfileTier) => tier === ProfileTier.PRO,
    }))
  })

  it('renders the Pro tier badge when user has Pro access', () => {
    render(<ProfilePage />)

    // Check if the Pro NFT image is rendered
    const badge = screen.getByAltText('PRO NFT') as HTMLImageElement
    expect(badge).toBeInTheDocument()

    // Verify the image source
    expect(badge).toHaveAttribute(
      'src',
      'https://ipfs.io/ipfs/QmQnkRY6b2ckAbYQtn7btBWw3p2LcL2tZReFxViJ3aayk3'
    )
  })

  it('does not render badge for Free tier', () => {
    // Mock Free tier
    ;(useProfile as jest.Mock).mockImplementation(() => ({
      currentTier: ProfileTier.FREE,
      canAccessTier: (tier: ProfileTier) => tier === ProfileTier.FREE,
    }))

    render(<ProfilePage />)

    // Verify no badge is present
    const badge = screen.queryByAltText(/NFT/) as HTMLImageElement | null
    expect(badge).not.toBeInTheDocument()
  })

  it('renders the Group tier badge when user has Group access', () => {
    // Mock Group tier
    ;(useProfile as jest.Mock).mockImplementation(() => ({
      currentTier: ProfileTier.GROUP,
      canAccessTier: (tier: ProfileTier) => tier === ProfileTier.GROUP,
    }))

    render(<ProfilePage />)

    // Check if the Group NFT image is rendered
    const badge = screen.getByAltText('GROUP NFT') as HTMLImageElement
    expect(badge).toBeInTheDocument()

    // Verify the image source
    expect(badge).toHaveAttribute(
      'src',
      'https://ipfs.io/ipfs/QmRNqHVG9VHBafsd9ypQt82rZwVMd14Qt2DWXiK5dptJRs'
    )
  })
})

// Export types
export * from '@/app/[locale]/(authenticated)/profile/profile'

// Export hooks
export * from './components/hooks/useProfileSystem'
export * from './components/hooks/useProfileRegistry'

// Export services
export { ProfileService, ProfileEdgeService } from './services/profile.service'
export * from './services/profile-ipfs.service'

// Export provider
export * from '@/app/api/providers/ProfileProvider'

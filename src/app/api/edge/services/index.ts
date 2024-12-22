export * from './types'
export * from './base'
export * from './kitchen'

// Re-export service instances
export { kitchenEdgeService } from './kitchen'

// Import the profile management functions
import {
  createProfile,
  updateProfile,
  deleteProfile,
} from '@/app/[locale]/(authenticated)/profile/services/server/profile-management.service'

// Create a class wrapper
export class ProfileApiService {
  createProfile = createProfile
  updateProfile = updateProfile
  deleteProfile = deleteProfile
}

import type {
  ProfileMetadata,
  FreeProfileMetadata,
  ProProfileMetadata,
  GroupProfileMetadata,
} from './profile'

export function isFreeProfile(profile: ProfileMetadata): profile is FreeProfileMetadata {
  return !('experience' in profile) && !('organizationInfo' in profile)
}

export function isProProfile(profile: ProfileMetadata): profile is ProProfileMetadata {
  return 'experience' in profile && !('organizationInfo' in profile)
}

export function isGroupProfile(profile: ProfileMetadata): profile is GroupProfileMetadata {
  return 'organizationInfo' in profile
}

export function getProfileTier(profile: ProfileMetadata): 'free' | 'pro' | 'group' {
  if (isGroupProfile(profile)) return 'group'
  if (isProProfile(profile)) return 'pro'
  return 'free'
}

export const ROUTES = {
  // Public routes that don't require authentication
  PUBLIC: ['/', '/pricing', '/features', '/explore', '/club'] as const,

  // Routes that are part of the profile creation flow
  PROFILE: ['/profile', '/profile/create'] as const,

  // Routes that require authentication but not a profile
  AUTH_ONLY: [
    '/kitchen',
    '/kitchen/explore',
    '/club',
    '/tier',
    '/admin',
    '/admin/users',
    '/admin/recipes',
  ] as const,

  // Marketing routes
  MARKETING: ['/', '/features', '/pricing', '/explore', '/club'] as const,
} as const

// Helper functions
export const isPublicRoute = (pathname: string) => ROUTES.PUBLIC.includes(pathname as any)
export const isProfileRoute = (pathname: string) =>
  ROUTES.PROFILE.some((route) => pathname.startsWith(route))
export const isAuthOnlyRoute = (pathname: string) =>
  ROUTES.AUTH_ONLY.some((route) => pathname.startsWith(route))
export const isMarketingRoute = (pathname: string) => ROUTES.MARKETING.includes(pathname as any)

// Special case checks
export const isProfileCreate = (pathname: string) => pathname.startsWith('/profile/create')
export const isKitchenRoute = (pathname: string) => pathname.startsWith('/kitchen')

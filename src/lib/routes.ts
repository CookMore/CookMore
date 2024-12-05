export const ROUTES = {
  // Marketing routes (public)
  MARKETING: {
    HOME: '/',
    FEATURES: '/features',
    EXPLORE: '/explore',
    PRICING: '/pricing',
    CLUB: '/club',
  },

  // Authenticated routes
  AUTH: {
    KITCHEN: {
      HOME: '/kitchen',
      EXPLORE: '/kitchen/explore',
      CLUB: '/kitchen/club',
      TIER: '/kitchen/tier',
    },
    PROFILE: {
      HOME: '/profile',
      CREATE: '/profile/create',
      SETTINGS: '/profile/settings',
    },
    ADMIN: '/admin',
  },
}

// Route protection configurations
export const routeConfig = {
  // Public routes that don't require auth
  public: [
    ROUTES.MARKETING.HOME,
    ROUTES.MARKETING.FEATURES,
    ROUTES.MARKETING.EXPLORE,
    ROUTES.MARKETING.PRICING,
    ROUTES.MARKETING.CLUB,
  ],

  // Routes that require authentication
  protected: [
    ROUTES.AUTH.KITCHEN.HOME,
    ROUTES.AUTH.KITCHEN.EXPLORE,
    ROUTES.AUTH.KITCHEN.CLUB,
    ROUTES.AUTH.KITCHEN.TIER,
    ROUTES.AUTH.PROFILE.HOME,
    ROUTES.AUTH.PROFILE.SETTINGS,
  ],

  // Routes that require profile
  requiresProfile: [
    ROUTES.AUTH.KITCHEN.HOME,
    ROUTES.AUTH.KITCHEN.EXPLORE,
    ROUTES.AUTH.KITCHEN.CLUB,
    ROUTES.AUTH.KITCHEN.TIER,
  ],

  // Admin only routes
  adminOnly: [ROUTES.AUTH.ADMIN],

  // Special routes with custom handling
  special: {
    profileCreate: ROUTES.AUTH.PROFILE.CREATE,
  },
}

// Helper functions
export const isKitchenRoute = (pathname: string) => pathname.startsWith(ROUTES.AUTH.KITCHEN.HOME)

export const isProfileRoute = (pathname: string) => pathname.startsWith(ROUTES.AUTH.PROFILE.HOME)

export const isAdminRoute = (pathname: string) => pathname.startsWith(ROUTES.AUTH.ADMIN)

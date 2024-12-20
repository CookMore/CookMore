export const ROUTES = {
  // Marketing routes (public)
  MARKETING: {
    HOME: '/',
    FEATURES: '/features',
    DISCOVER: '/discover',
    PRICING: '/pricing',
    CLUB: '/club',
    EXPLORE: '/discover',
    GET_STARTED: '/pricing',
  },

  // Authenticated routes
  AUTH: {
    KITCHEN: {
      HOME: '/kitchen',
      CLUB: '/kitchen/club',
    },
    CALENDAR: '/calendar',
    EXPLORE: '/explore',
    TIER: '/tier',
    PROFILE: {
      HOME: '/profile/address',
      CREATE: '/profile/create',
      EDIT: '/profile/edit',
    },
    ADMIN: '/admin',
  },
}

// Route protection configurations
export const routeConfig = {
  // Public routes that don't require auth
  public: ['/club', '/discover', '/features', '/pricing', '/(marketing)'],

  // Routes that require authentication
  protected: ['/(authenticated)'],

  // Routes that require profile
  requiresProfile: [
    ROUTES.AUTH.KITCHEN.HOME,
    ROUTES.AUTH.EXPLORE,
    ROUTES.AUTH.KITCHEN.CLUB,
    ROUTES.AUTH.CALENDAR,
    ROUTES.AUTH.TIER,
  ],

  // Admin only routes
  adminOnly: [ROUTES.AUTH.ADMIN],

  // Special routes with custom handling
  special: {
    profileCreate: ROUTES.AUTH.PROFILE.CREATE,
  },
}

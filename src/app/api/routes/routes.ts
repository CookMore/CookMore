export const ROUTES = {
  // Marketing routes (public)
  MARKETING: {
    HOME: '/',
    FEATURES: '/features',
    DISCOVER: '/discover',
    PRICING: '/pricing',
    EXPLORE: '/discover',
    GET_STARTED: '/pricing',
  },

  // Authenticated routes
  AUTH: {
    KITCHEN: '/kitchen',
    CALENDAR: '/calendar',
    EXPLORE: '/explore',
    TIER: '/tier',
    PROFILE: {
      HOME: '/profile',
      CREATE: '/profile/create',
      EDIT: '/profile/edit',
    },
    RECIPE: '/recipe',
    ADMIN: '/admin',
    DASHBOARD: '/dashboard',
    MEMBERS: '/members',
  },
}

// Route protection configurations
export const routeConfig = {
  // Public routes that don't require auth
  public: ['/discover', '/features', '/pricing', '/(marketing)'],

  // Routes that require authentication
  protected: ['/(authenticated)'],

  // Routes that require profile
  requiresProfile: [
    ROUTES.AUTH.KITCHEN,
    ROUTES.AUTH.EXPLORE,
    ROUTES.AUTH.CALENDAR,
    ROUTES.AUTH.TIER,
    ROUTES.AUTH.RECIPE,
    ROUTES.AUTH.DASHBOARD,
    ROUTES.AUTH.MEMBERS,
  ],

  // Admin only routes
  adminOnly: [ROUTES.AUTH.ADMIN],

  // Special routes with custom handling
  special: {
    profileCreate: ROUTES.AUTH.PROFILE.CREATE,
  },
}

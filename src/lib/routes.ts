export const ROUTES = {
  // Marketing routes (public)
  MARKETING: {
    HOME: '/',
    FEATURES: '/features',
    DISCOVER: '/discover',
    PRICING: '/pricing',
    CLUB: '/club',
  },

  // Authenticated routes
  AUTH: {
    LOGIN: '/login',
    KITCHEN: {
      HOME: '/kitchen',
      CLUB: '/kitchen/club',
    },
    CALENDAR: '/calendar',
    EXPLORE: '/explore',
    TIER: '/tier',
    PROFILE: {
      HOME: '/profile',
      CREATE: '/profile/create',
      EDIT: '/profile/edit',
      STEPS: {
        SELECT_TIER: '/profile/create/select-tier',
        BASIC: '/profile/create/basic',
        PRO: '/profile/create/pro',
        GROUP: '/profile/create/group',
        MINT: '/profile/create/mint',
      },
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
    ROUTES.MARKETING.DISCOVER,
    ROUTES.MARKETING.PRICING,
    ROUTES.MARKETING.CLUB,
  ] as const,

  // Routes that require authentication
  protected: [
    ROUTES.AUTH.KITCHEN.HOME,
    ROUTES.AUTH.EXPLORE,
    ROUTES.AUTH.KITCHEN.CLUB,
    ROUTES.AUTH.CALENDAR,
    ROUTES.AUTH.TIER,
    ROUTES.AUTH.PROFILE.HOME,
    ROUTES.AUTH.PROFILE.CREATE,
    ROUTES.AUTH.PROFILE.EDIT,
    ROUTES.AUTH.PROFILE.STEPS.BASIC,
    ROUTES.AUTH.PROFILE.STEPS.PRO,
    ROUTES.AUTH.PROFILE.STEPS.GROUP,
    ROUTES.AUTH.PROFILE.STEPS.MINT,
  ] as const,

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

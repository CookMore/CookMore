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
    PLAN: '/plan',
    EXPLORE: '/explore',
    TIER: '/tier',
    PROFILE: {
      HOME: '/profile',
      CREATE: '/profile/create',
      EDIT: '/profile/edit',
      ADDRESS: (address: string) => `/profile/address/${address}`, // Dynamic profile route
    },
    RECIPE: {
      CREATE: '/recipe/create',
      EDIT: '/recipe/edit',
    },
    ADMIN: '/admin',
    DASHBOARD: '/dashboard',
    MEMBERS: '/members',
    WIKI: '/wiki',
    NEWS: '/news',
    JOBS: '/jobs',
    NOTES: '/notes',
    MENU: '/menu',
  },
}

// Route protection configurations
export const routeConfig = {
  // Public routes that don't require authentication
  public: [
    ROUTES.MARKETING.HOME,
    ROUTES.MARKETING.DISCOVER,
    ROUTES.MARKETING.FEATURES,
    ROUTES.MARKETING.PRICING,
    ROUTES.MARKETING.EXPLORE,
    '/(marketing)',
  ],

  // Routes that require authentication
  protected: ['/(authenticated)', ROUTES.AUTH.PROFILE.HOME],

  // Routes that require an existing profile
  requiresProfile: [
    ROUTES.AUTH.KITCHEN,
    ROUTES.AUTH.EXPLORE,
    ROUTES.AUTH.PLAN,
    ROUTES.AUTH.TIER,
    ROUTES.AUTH.RECIPE.CREATE,
    ROUTES.AUTH.RECIPE.EDIT,
    ROUTES.AUTH.DASHBOARD,
    ROUTES.AUTH.MEMBERS,
    ROUTES.AUTH.WIKI,
    ROUTES.AUTH.NOTES,
    ROUTES.AUTH.MENU,
    ROUTES.AUTH.PROFILE.EDIT,
  ],

  // Admin only routes
  adminOnly: [ROUTES.AUTH.ADMIN],

  // Special routes with custom handling
  special: {
    profileCreate: ROUTES.AUTH.PROFILE.CREATE,
  },
}

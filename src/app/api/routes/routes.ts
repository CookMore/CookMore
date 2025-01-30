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
  // Public routes that don't require auth
  public: ['/discover', '/features', '/pricing', '/(marketing)'],

  // Routes that require authentication
  protected: ['/(authenticated)'],

  // Routes that require profile
  requiresProfile: [
    ROUTES.AUTH.KITCHEN,
    ROUTES.AUTH.EXPLORE,
    ROUTES.AUTH.PLAN,
    ROUTES.AUTH.TIER,
    ROUTES.AUTH.RECIPE,
    ROUTES.AUTH.DASHBOARD,
    ROUTES.AUTH.MEMBERS,
    ROUTES.AUTH.WIKI,
    ROUTES.AUTH.NOTES,
    ROUTES.AUTH.MENU,
  ],

  // Admin only routes
  adminOnly: [ROUTES.AUTH.ADMIN],

  // Special routes with custom handling
  special: {
    profileCreate: ROUTES.AUTH.PROFILE.CREATE,
  },
}

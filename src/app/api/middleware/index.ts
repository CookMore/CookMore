import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from './auth'

// Route configuration for different auth requirements
const ROUTES = {
  public: ['/api/health', '/api/i18n'],
  requiresAuth: ['/api/profile/create', '/api/recipes'],
  requiresProfile: [
    '/api/kitchen',
    '/api/recipes/create',
    '/api/calendar',
    '/api/explore',
    '/api/tier',
    '/api/recipe',
    '/api/dashboard',
    '/api/profile',
  ],
  adminOnly: ['/api/admin'],
} as const

// Helper to add CORS headers
function addCorsHeaders(response: NextResponse) {
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )
  return response
}

export async function withApiMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  try {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return addCorsHeaders(new NextResponse(null, { status: 200 }))
    }

    // Skip middleware for non-API routes
    if (!pathname.startsWith('/api')) {
      return NextResponse.next()
    }

    let response: NextResponse

    // Allow public routes
    if (ROUTES.public.some((route) => pathname.startsWith(route))) {
      response = NextResponse.next()
    }
    // Check admin routes first
    else if (ROUTES.adminOnly.some((route) => pathname.startsWith(route))) {
      response = await withAuth(request, { requireAdmin: true })
    }
    // Check profile-required routes
    else if (ROUTES.requiresProfile.some((route) => pathname.startsWith(route))) {
      response = await withAuth(request, { requireProfile: true })
    }
    // Check auth-required routes
    else if (ROUTES.requiresAuth.some((route) => pathname.startsWith(route))) {
      response = await withAuth(request)
    }
    // Default to requiring authentication
    else {
      response = await withAuth(request)
    }

    // Add CORS headers to all responses
    return addCorsHeaders(response)
  } catch (error) {
    console.error('API middleware error:', error)
    const errorResponse = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    return addCorsHeaders(errorResponse)
  }
}

// Export route configuration for use in other parts of the app
export { ROUTES }

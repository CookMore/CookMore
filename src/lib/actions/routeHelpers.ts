'use server'

import { ROUTES } from '../routes'

export async function isKitchenRoute(pathname: string) {
  return pathname.startsWith(ROUTES.AUTH.KITCHEN.HOME)
}

export async function isProfileRoute(pathname: string) {
  return pathname.startsWith(ROUTES.AUTH.PROFILE.HOME)
}

export async function isAdminRoute(pathname: string) {
  return pathname.startsWith(ROUTES.AUTH.ADMIN)
}

export async function isExploreRoute(pathname: string) {
  return pathname === ROUTES.AUTH.EXPLORE || pathname === ROUTES.MARKETING.DISCOVER
}

/**
 * Centralized route-to-permission mapping.
 * Used by both the Sidebar (to hide nav items) and PermissionGate (to guard pages).
 */
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/dashboard/cms/work': ['works.read'],
  '/dashboard/cms/aboutus': ['about_us.manage'],
  '/dashboard/cms/blog': ['blogs.manage'],
  '/dashboard/users': ['users.manage'],
  '/dashboard/applications': ['applications.manage'],
  '/dashboard/parties': ['parties:read'],
  '/dashboard/quotations': ['quotations:read'],
  '/dashboard/contracts': ['contracts:read'],
  '/dashboard/donations': ['donations.manage'],
  '/dashboard/services': ['services.view'],
  '/dashboard/invoices': ['invoices.view']
}

export function hasPermission(
  userPermissions: string[],
  required: string[]
): boolean {
  return required.some(p => userPermissions.includes(p))
}

export function getPermissionsForRoute(pathname: string): string[] | undefined {
  // Check for exact match first, then prefix match for sub-routes
  for (const [route, perms] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return perms
    }
  }
  return undefined
}

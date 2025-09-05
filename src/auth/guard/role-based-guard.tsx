'use client';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export type RoleBasedGuardProp = Readonly<{
  acceptRoles: string[];
  menuPermission?: Record<string, boolean>;
  requiredPermission?: string;
  children: React.ReactNode;
}>;

export function RoleBasedGuard({
  children,
  acceptRoles,
  menuPermission = {},
  requiredPermission,
}: RoleBasedGuardProp) {
  const { user } = useAuthContext();

  if (acceptRoles.includes(user?.role)) {
    if (user?.role === 'company_manager' && requiredPermission) {
      return menuPermission[requiredPermission] ? <>{children}</> : null;
    }
    return <>{children}</>;
  }

  return null;
}

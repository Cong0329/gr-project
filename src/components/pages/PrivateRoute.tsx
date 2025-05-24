import { Navigate, useLocation } from "react-router-dom";
import { useAuth, useAuthRole } from "../admin/hooks/useAuthRole";

// src/routes/PrivateRoute.tsx
export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();
  const { roles } = useAuthRole();
  const location = useLocation();

  console.log("Auth check:", {
    path: location.pathname,
    isAuthenticated,
    roles: roles.map((r) => r.code),
    allowedRoles,
  });

  if (location.pathname.includes("/verify")) {
    return <>{children}</>;
  }

  // Check role như bình thường
  const hasPermission = roles.some((role) => allowedRoles.includes(role.code));

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, userInfo, verify } = useSelector(
    (state: RootState) => state.auth
  );
  const userRole = userInfo?.role || "";

  // Log current access control state (for debugging)
  console.log("PrivateRoute access control:", {
    isAuthenticated,
    userRole,
    verify,
    allowedRoles,
    hasAccess: isAuthenticated && verify && allowedRoles.includes(userRole),
  });

  // Not authenticated at all - redirect to appropriate signin
  if (!isAuthenticated) {
    // Determine which signin page to use based on requested role
    const targetRole = allowedRoles[0]; // Use first allowed role as the target
    const signinPath =
      targetRole === "ROLE_ADMIN" ? "/admin/signin" : "/doctor/signin";
    return <Navigate to={signinPath} replace />;
  }

  // Authenticated but not verified - redirect to verification
  if (!verify) {
    const verifyPath =
      userRole === "ROLE_ADMIN" ? "/admin/verify" : "/doctor/verify";
    return <Navigate to={verifyPath} replace />;
  }

  // Authenticated and verified but wrong role - redirect to appropriate area
  if (!allowedRoles.includes(userRole)) {
    const homePath = userRole === "ROLE_ADMIN" ? "/admin" : "/doctor";
    return <Navigate to={homePath} replace />;
  }

  // User has the right role and is authenticated - render the page
  return <>{children}</>;
};

export default PrivateRoute;

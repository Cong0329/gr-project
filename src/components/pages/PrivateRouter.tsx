import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../redux/store";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, role, verify } = useSelector(
    (state: RootState) => state.auth
  );

  const userRole = Array.isArray(role) ? role[0] : role || "";

  console.log("PrivateRoute access control:", {
    isAuthenticated,
    userRole,
    verify,
    allowedRoles,
    roleRaw: role,
    hasAccess: isAuthenticated && verify && allowedRoles.includes(userRole),
  });

  if (!isAuthenticated) {
    const targetRole = allowedRoles[0];
    const signinPath = targetRole === "ROLE_ADMIN" ? "/admin/signin" : "/doctor/signin";
    return <Navigate to={signinPath} replace />;
  }

  // if (!verify) {
  //   const verifyPath = userRole === "ROLE_ADMIN" ? "/admin/verify" : "/doctor/verify";
  //   return <Navigate to={verifyPath} replace />;
  // }

  if (!allowedRoles.includes(userRole)) {
    const homePath = userRole === "ROLE_ADMIN" ? "/admin" : "/doctor";
    return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

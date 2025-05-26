import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../redux/store";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  const userRole = Array.isArray(role) ? role[0] : role || "";


  if (!isAuthenticated) {
    const targetRole = allowedRoles[0];
    const signinPath = targetRole === "ROLE_ADMIN" ? "/admin/signin" : "/doctor/signin";
    return <Navigate to={signinPath} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    const homePath = userRole === "ROLE_ADMIN" ? "/admin" : "/doctor";
    return <Navigate to={homePath} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

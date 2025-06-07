import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../redux/store";

const RoleRedirect = () => {
  const { isAuthenticated, role, verify } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Log the current state for debugging - can be removed in production
    console.log("RoleRedirect state:", { isAuthenticated, role, verify });
  }, [isAuthenticated, role, verify]);

  // Not authenticated - redirect to admin signin
  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" replace />;
  }

  // Authenticated but not verified - redirect to verification
  if (!verify) {
    const verifyPath =
      role.includes("ROLE_ADMIN") ? "/admin/verify" : "/doctor/verify";
    return <Navigate to={verifyPath} replace />;
  }

  // Authenticated and verified - redirect based on role
  if (role.includes("ROLE_ADMIN")) {
    return <Navigate to="/admin" replace />;
  } else if (role.includes("ROLE_DOCTOR")) {
    return <Navigate to="/doctor" replace />;
  }

  // Fallback - if role is unknown, go to admin signin
  return <Navigate to="/admin/signin" replace />;
};

export default RoleRedirect;

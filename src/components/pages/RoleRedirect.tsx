import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../redux/store";

const RoleRedirect = () => {
  const { isAuthenticated, userInfo, verify } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Log the current state for debugging - can be removed in production
    console.log("RoleRedirect state:", { isAuthenticated, userInfo, verify });
  }, [isAuthenticated, userInfo, verify]);

  // Not authenticated - redirect to admin signin
  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" replace />;
  }

  // Authenticated but not verified - redirect to verification
  if (!verify) {
    const verifyPath =
      userInfo?.role === "ROLE_ADMIN" ? "/admin/verify" : "/doctor/verify";
    return <Navigate to={verifyPath} replace />;
  }

  // Authenticated and verified - redirect based on role
  if (userInfo?.role === "ROLE_ADMIN") {
    return <Navigate to="/admin" replace />;
  } else if (userInfo?.role === "ROLE_DOCTOR") {
    return <Navigate to="/doctor" replace />;
  }

  // Fallback - if role is unknown, go to admin signin
  return <Navigate to="/admin/signin" replace />;
};

export default RoleRedirect;

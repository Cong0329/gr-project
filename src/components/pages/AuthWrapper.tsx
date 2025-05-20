import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../redux/store";
import { reset } from "../../redux/authSlice";

interface AuthWrapperProps {
  children: React.ReactNode;
  role: string;
  redirectTo: string;
}

const AuthWrapper = ({ children, role, redirectTo }: AuthWrapperProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { isAuthenticated, verify } = useSelector(
    (state: RootState) => state.auth
  );
  const userRole = useSelector((state: RootState) => state.auth.role);

  // Reset auth state when mounting auth pages
  useEffect(() => {
    // Chỉ reset khi đang ở trang đăng nhập/đăng ký
    if (
      window.location.pathname.includes("signin") ||
      window.location.pathname.includes("signup")
    ) {
      dispatch(reset());
    }
  }, [dispatch]);

  useEffect(() => {
    // Log the current auth state for debugging - can be removed in production
    console.log("Auth state:", {
      isAuthenticated,
      userRole,
      verify,
      expectedRole: role,
    });
  }, [isAuthenticated, userRole, verify, role]);

  // Chỉ chuyển hướng người dùng khi họ đã được xác thực đúng
  if (isAuthenticated && verify && userRole === role) {
    console.log(
      `User authenticated with correct role (${role}), redirecting to ${redirectTo}`
    );
    return <Navigate to={redirectTo} replace />;
  }

  // Chỉ chuyển hướng đến trang xác minh khi người dùng đã đăng nhập thành công
  // và trạng thái không phải từ mount component
  if (
    isAuthenticated &&
    !verify &&
    window.sessionStorage.getItem("loginAttempted") === "true"
  ) {
    const verifyPath =
      role === "ROLE_ADMIN" ? "/admin/verify" : "/doctor/verify";
    console.log(
      `User authenticated but not verified, redirecting to ${verifyPath}`
    );
    return <Navigate to={verifyPath} replace />;
  }

  // If user is authenticated but has a different role, redirect to appropriate signin
  if (isAuthenticated && userRole && userRole !== role) {
    const signinPath =
      userRole === "ROLE_ADMIN" ? "/admin/signin" : "/doctor/signin";
    console.log(
      `User has incorrect role (${userRole}), redirecting to ${signinPath}`
    );
    return <Navigate to={signinPath} replace />;
  }

  // Otherwise, render the children (auth pages)
  return <>{children}</>;
};

export default AuthWrapper;

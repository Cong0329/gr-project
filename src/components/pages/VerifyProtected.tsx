import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from '../../redux/store';


const VerifyProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const { verify, isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  // const isDoctorRoute = location.pathname.startsWith("/doctor");
  // Nếu chưa xác minh email, redirect về signin
  if (!verify && !isAuthenticated) {
    const signinPath = isAdminRoute ? "/admin/signin" : "/doctor/signin";
    return <Navigate to={signinPath} replace />;
  }
  
  // Nếu đã xác minh và đã đăng nhập, chuyển đến admin dashboard
  if (isAuthenticated && role) {
    return <Navigate to={role === "ROLE_ADMIN" ? "/admin" : "/doctor"} replace />;
  }

  // Nếu chưa xác minh và chưa đăng nhập, render trang verify
  return <>{children}</>;
};

export default VerifyProtectedRoute;

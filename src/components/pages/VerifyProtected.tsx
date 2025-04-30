import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../redux/store';

const VerifyProtectedRoute = () => {
  const { verify, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Nếu chưa xác minh email, redirect về signin
  if (!verify && !isAuthenticated) {
    return <Navigate to="/admin/signin" replace />;
  }
  
  // Nếu đã xác minh và đã đăng nhập, chuyển đến admin dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Nếu chưa xác minh và chưa đăng nhập, render trang verify
  return <Outlet />;
};

export default VerifyProtectedRoute;

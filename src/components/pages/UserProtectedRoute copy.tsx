import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../redux/store';

const UserProtectedRoute = () => {
  const { isUserAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isUserAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;

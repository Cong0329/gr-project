
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../redux/store';

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" replace />;
  } 
  return children;
};

export default AdminProtectedRoute;

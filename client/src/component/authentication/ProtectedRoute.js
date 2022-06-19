import { useAuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useAuthContext();
  const location = useLocation();

  if (!isLogin) {
    return <Navigate to='/login' replace state={{ from: location }} />
  }
  return children;
};

export default ProtectedRoute;
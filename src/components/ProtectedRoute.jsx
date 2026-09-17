import { Navigate, Outlet, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ roles }) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="p-10 text-center">Checking authentication...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

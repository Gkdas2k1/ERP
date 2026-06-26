import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Add 'requiredRole' prop. If not provided, any logged-in user can access it.
export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and the user doesn't have it (and isn't admin)
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    // Kick them out immediately
    localStorage.removeItem('erp_token');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
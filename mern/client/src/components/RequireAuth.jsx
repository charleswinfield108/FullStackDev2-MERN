// RequireAuth Component - Route guard/protection wrapper
// Ensures only authenticated users can access protected routes
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RequireAuth({ children }) {
  const location = useLocation(); // Get current location for redirect after login
  const { isAuthenticated, isLoading } = useAuth(); // Check authentication status from context

  // Show loading while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Or a custom loading component
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated, render protected content
  return children;
}

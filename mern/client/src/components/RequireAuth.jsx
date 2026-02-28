// RequireAuth Component - Route guard/protection wrapper
// Ensures only authenticated users can access protected routes
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const location = useLocation(); // Get current location for redirect after login
  const token = sessionStorage.getItem('authToken'); // Check if user has valid token

  // If no token, redirect to login page and save current location
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If token exists, render protected content
  return children;
}

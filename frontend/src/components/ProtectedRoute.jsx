import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute
 * --------------
 * A wrapper component that redirects users to the login page if
 * they are not authenticated. To protect a route, wrap the
 * component you wish to render in <ProtectedRoute>. The logic
 * checks for the presence of a JWT in localStorage. If absent,
 * users are redirected to the /login path.
 *
 * Usage:
 * <ProtectedRoute>
 *   <DashboardLayout />
 * </ProtectedRoute>
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
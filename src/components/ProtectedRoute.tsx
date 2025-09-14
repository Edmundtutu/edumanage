import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // Wait while auth is bootstrapping so we don't redirect prematurely
  // `loading` is optional on the context type but provided by AuthProvider
  const auth = useAuth();
  const loading = (auth as any).loading as boolean | undefined;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Checking session..." /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
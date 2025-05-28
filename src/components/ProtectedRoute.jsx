// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './login/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // o un spinner

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
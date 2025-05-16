// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.rol !== 'Administrador') {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Jika sedang loading, tampilkan loading
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Jika tidak terotentikasi, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute; 
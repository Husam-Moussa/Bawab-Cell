import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is admin (using the admin email from the codebase)
  if (!user || user.email !== 'admin@bawabcell.com') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedAdminRoute; 
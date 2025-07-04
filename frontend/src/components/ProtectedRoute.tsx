import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';

export const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

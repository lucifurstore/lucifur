import React from 'react';
import { Navigate } from 'react-router-dom';

// Decode a JWT payload without a library and check expiry client-side.
// NOTE: This is a UX guard only — real security is enforced server-side.
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds; Date.now() is in ms
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // malformed token → treat as expired
  }
};

const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  if (!adminToken || adminInfo.role !== 'admin' || isTokenExpired(adminToken)) {
    // Clear stale data if the token is expired or tampered with
    const expired = !!(adminToken && isTokenExpired(adminToken));
    if (expired) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
    }
    return <Navigate to="/admin/login" state={expired ? { expired: true } : undefined} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;

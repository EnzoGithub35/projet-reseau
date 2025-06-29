import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import AuthLinks from '../components/auth/AuthLinks';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <>
      <LoginForm />
      <AuthLinks />
    </>
  );
};

export default LoginPage;

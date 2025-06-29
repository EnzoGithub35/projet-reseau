import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import AuthLinks from '../components/auth/AuthLinks';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <>
      <RegisterForm />
      <AuthLinks />
    </>
  );
};

export default RegisterPage;

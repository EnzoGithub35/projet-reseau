import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AuthLinks = () => {
  const location = useLocation();
  return (
    <div className="flex justify-center mt-4 space-x-4">
      {location.pathname !== '/login' && (
        <Link to="/login" className="text-indigo-600 hover:underline text-sm">Se connecter</Link>
      )}
      {location.pathname !== '/register' && (
        <Link to="/register" className="text-indigo-600 hover:underline text-sm">Créer un compte</Link>
      )}
    </div>
  );
};

export default AuthLinks;

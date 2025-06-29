import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError('');
    setRegisterSuccess('');
    try {
      await api.post('/auth/register', data);
      setRegisterSuccess('Compte créé avec succès. Vous pouvez vous connecter.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Erreur lors de la création du compte');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                {...register('fullname', { required: 'Nom complet requis' })}
                type="text"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nom complet"
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
              )}
            </div>
            <div>
              <input
                {...register('username', { required: 'Nom d\'utilisateur requis' })}
                type="text"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nom d'utilisateur"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            <div>
              <input
                {...register('email', { required: 'Email requis', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Email invalide' } })}
                type="email"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                {...register('password', { required: 'Mot de passe requis', minLength: { value: 6, message: '6 caractères minimum' } })}
                type="password"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mot de passe"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          {registerError && (
            <div className="text-red-600 text-sm text-center">{registerError}</div>
          )}
          {registerSuccess && (
            <div className="text-green-600 text-sm text-center">{registerSuccess}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            className="text-indigo-600 hover:underline text-sm"
            onClick={() => navigate('/login')}
          >
            Déjà un compte ? Se connecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

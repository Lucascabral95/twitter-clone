'use client';

import { useLogin } from '@/presentation/hooks';
import React from 'react';

const LoginPage: React.FC = () => {
  const { handleLogin, isLoading } = useLogin();

  return (
    <div>
      <h1>Home login</h1>

      <form action={handleLogin} style={{ color: 'red' }}>
        <input
          type="email"
          name="email"
          placeholder="Ingresa tu email"
          disabled={isLoading}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

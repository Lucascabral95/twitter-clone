import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';

jest.mock('@/presentation/hooks/useRegister', () => ({
  useRegister: (onSuccess: any, onOpenLogin: any) => ({
    error: { nombre: undefined, email: undefined, password: undefined },
    errorSimple: '',
    isLoading: false,
    handleRegister: (e: any) => { e.preventDefault(); onSuccess(); onOpenLogin(); },
  }),
}));

it('renders and submits register form', () => {
  const setIsOpenRegister = jest.fn();
  const setIsOpenLogin = jest.fn();
  render(React.createElement(Register, { setIsOpenRegister, setIsOpenLogin }));

  fireEvent.change(screen.getByPlaceholderText('Nombre y apellido'), { target: { value: 'Lucas' } });
  fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'a@a.com' } });
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '12345678' } });

  fireEvent.submit(screen.getByRole('button', { name: /Crear cuenta|Creando cuenta/ }));

  expect(setIsOpenRegister).toHaveBeenCalledWith(false);
  expect(setIsOpenLogin).toHaveBeenCalledWith(true);
});

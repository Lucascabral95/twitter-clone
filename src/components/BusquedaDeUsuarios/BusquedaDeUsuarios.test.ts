import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BusquedaDeUsuarios from './BusquedaDeUsuarios';
import useStore from '@/zustand';

test('renders users and triggers follow', () => {
  const seguirUsuario = jest.fn();
  (useStore as any).__setMockState({ datosLogueo: { id: 1 }, misSeguidos: [], seguirUsuario });
  const usuarios = [{ id: 2, email: 'u2@test.com', nombre: 'U2' }];
  render(React.createElement(BusquedaDeUsuarios, { usuarios }));
  const btn = screen.getByText('Seguir');
  fireEvent.click(btn);
  expect(seguirUsuario).toHaveBeenCalledWith(1, 2);
});

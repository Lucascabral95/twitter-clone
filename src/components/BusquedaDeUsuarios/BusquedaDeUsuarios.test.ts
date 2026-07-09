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

test('shows the default empty message when no mensajeVacio is provided', () => {
  (useStore as any).__setMockState({ datosLogueo: { id: 1 }, misSeguidos: [] });
  render(React.createElement(BusquedaDeUsuarios, { usuarios: [] }));
  expect(screen.getByText('Sin seguidores ni seguidos')).toBeInTheDocument();
});

test('shows a custom mensajeVacio when provided', () => {
  (useStore as any).__setMockState({ datosLogueo: { id: 1 }, misSeguidos: [] });
  render(React.createElement(BusquedaDeUsuarios, { usuarios: [], mensajeVacio: 'No encontramos usuarios para tu búsqueda.' }));
  expect(screen.getByText('No encontramos usuarios para tu búsqueda.')).toBeInTheDocument();
});

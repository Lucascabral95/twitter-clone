import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListaBusqueda from './ListaBusqueda';

it('renders palabra buscada and first user', () => {
  const cerrarBusqueda = jest.fn();
  const datos = [ { id: 1, email: 'a@a.com', nombre: 'Lucas' } ];
  render(React.createElement(ListaBusqueda, { datos, palabra: 'lucas', cerrarBusqueda }));
  expect(screen.getByText('lucas')).toBeInTheDocument();
  expect(screen.getByText('Lucas')).toBeInTheDocument();
  const link = screen.getByText('Lucas').closest('a')!;
  fireEvent.click(link);
  expect(cerrarBusqueda).toHaveBeenCalled();
});

it('shows a no-results message when there are no matches and it is not loading', () => {
  render(React.createElement(ListaBusqueda, { datos: [], palabra: 'zzz', cerrarBusqueda: jest.fn() }));
  expect(screen.getByText('No encontramos usuarios que coincidan con "zzz".')).toBeInTheDocument();
});

it('does not show the no-results message while still loading', () => {
  render(React.createElement(ListaBusqueda, { datos: [], palabra: 'zzz', cerrarBusqueda: jest.fn(), cargando: true }));
  expect(screen.queryByText('No encontramos usuarios que coincidan con "zzz".')).not.toBeInTheDocument();
});

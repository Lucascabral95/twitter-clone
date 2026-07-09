import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BuscadorSuperior from './BuscadorSuperior';

jest.mock('@/presentation/hooks', () => ({
  useDebounce: (v: any) => v,
  useBusquedaUsuarios: () => ({ usuarios: [{ id: 1, email: 'a@a.com', nombre: 'Lucas' }], buscar: jest.fn() })
}));

it('renders the live search input and results', async () => {
  render(React.createElement(BuscadorSuperior));
  const input = await screen.findByPlaceholderText('Buscar usuario...');
  fireEvent.change(input, { target: { value: 'luc' } });
  expect(await screen.findByText('Lucas')).toBeInTheDocument();
});

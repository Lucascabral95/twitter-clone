import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

jest.mock('@/presentation/hooks', () => ({
  useDebounce: (v: any) => v,
  useBusquedaUsuarios: () => ({ usuarios: [{ id:1, email:'a@a.com', nombre:'Lucas' }], buscar: jest.fn() })
}));

it('renders search input and results', async () => {
  render(React.createElement(Navbar));
  const input = await screen.findByPlaceholderText('Buscar usuario...');
  fireEvent.change(input, { target: { value: 'luc' } });
  expect(await screen.findByText('Lucas')).toBeInTheDocument();
});

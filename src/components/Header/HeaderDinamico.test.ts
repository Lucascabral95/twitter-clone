import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import HeaderDinamico from './HeaderDinamico';
import useStore from '@/zustand';

beforeEach(() => {
  (useStore as any).__setMockState({ datosLogueo: { id: 2 } });
  jest.spyOn(axios, 'get').mockImplementation((url: any) => {
    if (String(url).includes('/api/usuario/1')) {
      return Promise.resolve({ status: 200, data: { result: { id:1, nombre:'Nombre', email:'a@a.com', fecha_creacion:'2024-01-01' } } });
    }
    if (String(url).includes('/api/seguimientos/seguidores/1')) {
      return Promise.resolve({ status: 200, data: { result: [] } });
    }
    if (String(url).includes('/api/seguimientos/1')) {
      return Promise.resolve({ status: 200, data: { result: [] } });
    }
    if (String(url).includes('/api/datospersonales/1')) {
      return Promise.resolve({ status: 200, data: { result: [{ biografia:'Bio', cumpleanos:'2000-01-01' }] } });
    }
    return Promise.resolve({ status: 200, data: { result: [] } });
  });
});

test('renders dynamic header with user name', async () => {
  render(React.createElement(HeaderDinamico, { id: 1 }));
  expect(await screen.findByText('Nombre')).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Comentarios from './Comentarios';
import useStore from '@/zustand';

beforeEach(() => {
  (useStore as any).__setMockState({ datosLogueo: { id: 1, email: 'a@a.com' } });
  jest.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: { result: [] } } as any);
});

test('renders textarea for comentar', () => {
  const dataPosteo = { posteo_id: 10 } as any;
  render(React.createElement(Comentarios, { dataPosteo }));
  expect(screen.getByPlaceholderText('Publicá tu respuesta...')).toBeInTheDocument();
});

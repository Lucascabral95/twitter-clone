import React from 'react';
import { render, screen } from '@testing-library/react';
import CardTweet from './CardTweet';
import useStore from '@/zustand';

beforeEach(() => { (useStore as any).__setMockState({ limit: 20, posteosTotales: 1 }); });

test('renders tweet content', () => {
  const posteos = [{ posteo_id:1, id:1, nombre:'N', email:'e', created_at:'2024-01-01', titulo:'T', contenido:'C', likes:0, identificador:'', fecha_creacion:'', updated_at:'', creador_id:1 }] as any[];
  render(React.createElement(CardTweet, { posteos }));
  expect(screen.getByText('T')).toBeInTheDocument();
  expect(screen.getByText('C')).toBeInTheDocument();
});

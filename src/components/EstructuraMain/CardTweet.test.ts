import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CardTweet from './CardTweet';
import useStore from '@/zustand';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

beforeEach(() => {
  (useStore as any).__setMockState({ limit: 20, posteosTotales: 1 });
  push.mockClear();
});

const posteos = [
  {
    posteo_id: 1,
    id: 1,
    nombre: 'N',
    email: 'e',
    created_at: '2024-01-01',
    titulo: 'T',
    contenido: 'C',
    likes: 0,
    identificador: '',
    fecha_creacion: '',
    updated_at: '',
    creador_id: 1,
  },
] as any[];

test('renders tweet content', () => {
  render(React.createElement(CardTweet, { posteos }));
  expect(screen.getByText('T')).toBeInTheDocument();
  expect(screen.getByText('C')).toBeInTheDocument();
});

test('navigates to tweet detail when clicking the card container', () => {
  render(React.createElement(CardTweet, { posteos }));

  fireEvent.click(screen.getByRole('link', { name: /Abrir posteo T/i }));

  expect(push).toHaveBeenCalledWith('/home/post/1');
});

test('does not hijack clicks on the author profile link', () => {
  render(React.createElement(CardTweet, { posteos }));

  fireEvent.click(screen.getByText('N'));

  expect(push).not.toHaveBeenCalled();
});

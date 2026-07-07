import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Posteo from './Posteo';
import * as PosteosFns from '@/utils/functions/Posteos';

jest.mock('@/utils/functions/Posteos', () => ({
  postearComentario: jest.fn((e: any) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    return Promise.resolve(true);
  }),
}));

it('submits form and calls postearComentario', async () => {
  const setIsOpenPosteo = jest.fn();
  const { container } = render(React.createElement(Posteo, { setIsOpenPosteo, email: 'a@a.com' }));
  const titulo = container.querySelector('input[name="titulo"]') as HTMLInputElement;
  fireEvent.change(titulo, { target: { value: 'Hola' } });
  const contenido = container.querySelector('textarea[name="contenido"]') as HTMLTextAreaElement;
  fireEvent.change(contenido, { target: { value: 'Contenido' } });
  const btn = screen.getByRole('button', { name: 'Postear' });
  fireEvent.click(btn);

  await waitFor(() => expect((PosteosFns as any).postearComentario).toHaveBeenCalled());
});

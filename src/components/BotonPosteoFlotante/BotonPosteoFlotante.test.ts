import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotonPosteoFlotante from './BotonPosteoFlotante';
import useStore from '@/zustand';

beforeEach(() => {
  (useStore as any).__setMockState({ datosLogueo: { id: 1, email: 'a@a.com', nombre: 'A' } });
});

test('opens post modal on click', () => {
  const { container } = render(React.createElement(BotonPosteoFlotante));
  const btn = container.querySelector('button.bot-posteo-flotante')!;
  fireEvent.click(btn);
  expect(screen.getByRole('button', { name: 'Postear' })).toBeInTheDocument();
});

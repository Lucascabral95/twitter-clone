import React from 'react';
import { render, screen } from '@testing-library/react';
import CardSecciones from './CardSecciones';
import useStore from '@/zustand';

beforeEach(() => { (useStore as any).__setMockState({ loading: false, misSeguidos: [] }); });

test('shows sections', () => {
  const publicaciones: any[] = [];
  render(React.createElement(CardSecciones, { id: 1, publicaciones }));
  expect(screen.getByText('Inicio')).toBeInTheDocument();
  expect(screen.getByText('Sobre mí')).toBeInTheDocument();
  expect(screen.getByText('Reposteos')).toBeInTheDocument();
});

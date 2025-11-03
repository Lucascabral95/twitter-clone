import React from 'react';
import { render, screen } from '@testing-library/react';
import EstructuraMain from './EstructuraMain';

test('renders children', () => {
  render(React.createElement(EstructuraMain, null, 'contenido'));
  expect(screen.getByText('contenido')).toBeInTheDocument();
});

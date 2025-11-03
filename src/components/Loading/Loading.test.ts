import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

test('renders loading text', () => {
  render(React.createElement(Loading));
  expect(screen.getByText('Cargando...')).toBeInTheDocument();
});

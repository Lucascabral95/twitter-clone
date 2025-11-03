import React from 'react';
import { render, screen } from '@testing-library/react';
import FooterInterior from './FooterInterior';

test('renders footer interior text', () => {
  render(React.createElement(FooterInterior));
  expect(screen.getByText(/Lucas Cabral Dev © 2024/i)).toBeInTheDocument();
});

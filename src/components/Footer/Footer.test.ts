import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders footer text', () => {
  render(React.createElement(Footer));
  expect(screen.getByText(/2024/i)).toBeInTheDocument();
});

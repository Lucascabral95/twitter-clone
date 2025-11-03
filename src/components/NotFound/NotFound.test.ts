import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

test('renders error message', () => {
  render(React.createElement(NotFound, { error: 'Error!' }));
  expect(screen.getByText('Error!')).toBeInTheDocument();
});

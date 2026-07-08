import React from 'react';
import { render, screen } from '@testing-library/react';
import PerfilTabs from './PerfilTabs';

jest.mock('next/navigation', () => ({
  usePathname: () => '/home/sobre-mi',
}));

it('renders the three tabs as links and marks the active one', () => {
  render(React.createElement(PerfilTabs, { base: '/home' }));

  const inicio = screen.getByText('Inicio').closest('a');
  const sobreMi = screen.getByText('Sobre mí').closest('a');
  const reposteos = screen.getByText('Reposteos').closest('a');

  expect(inicio).toHaveAttribute('href', '/home');
  expect(sobreMi).toHaveAttribute('href', '/home/sobre-mi');
  expect(reposteos).toHaveAttribute('href', '/home/reposteos');

  expect(sobreMi).toHaveClass('active');
  expect(inicio).not.toHaveClass('active');
  expect(reposteos).not.toHaveClass('active');
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

jest.mock('@/presentation/hooks', () => ({
  useNotificationsBadge: () => ({ noLeidas: 0, refrescar: jest.fn() })
}));

it('renders a link to /feed/search instead of an inline search input', async () => {
  render(React.createElement(Sidebar));
  const link = await screen.findByText('Buscar');
  expect(link.closest('a')).toHaveAttribute('href', '/feed/search');
});

it('toggles collapsed state and persists it to localStorage', async () => {
  render(React.createElement(Sidebar));
  const toggle = await screen.findByRole('button', { name: /colapsar menú/i });
  fireEvent.click(toggle);
  expect(localStorage.getItem('pulso-sidebar-collapsed')).toBe('true');
});

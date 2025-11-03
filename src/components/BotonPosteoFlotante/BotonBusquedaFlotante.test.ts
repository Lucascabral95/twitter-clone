import React from 'react';
import { render } from '@testing-library/react';
import BotonBusquedaFlotante from './BotonBusquedaFlotante';

test('render link to /feed/search', () => {
  const { container } = render(React.createElement(BotonBusquedaFlotante));
  const link = container.querySelector('a');
  expect(link).not.toBeNull();
  expect((link as HTMLAnchorElement).getAttribute('href') || '').toContain('/feed/search');
});

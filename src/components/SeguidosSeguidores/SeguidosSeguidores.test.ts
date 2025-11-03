import React from 'react';
import { render } from '@testing-library/react';
import SeguidosSeguidores from './SeguidosSeguidores';

it('closes on clicking close icon', () => {
  const setIsOpenSeguidosSeguidores = jest.fn();
  const misSeguidos = [] as any[];
  const { container } = render(React.createElement(SeguidosSeguidores, { setIsOpenSeguidosSeguidores, misSeguidos }));
  const close = container.querySelector('.icono-close-seguidos-seguidores .icono') as HTMLElement;
  if (close) { close.click(); }
  expect(setIsOpenSeguidosSeguidores).toHaveBeenCalledWith(false);
});

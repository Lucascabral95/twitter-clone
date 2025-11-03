import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import axios from 'axios';
import BotonLogoutFlotante from './BotonLogoutFlotante';

test('calls logout endpoint on click', async () => {
  jest.spyOn(axios, 'get').mockResolvedValue({ status: 200 } as any);
  const { container } = render(React.createElement(BotonLogoutFlotante));
  const link = container.querySelector('a')!;
  fireEvent.click(link);
  expect(axios.get).toHaveBeenCalledWith('/api/auth/logout');
});

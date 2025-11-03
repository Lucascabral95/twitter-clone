import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import Login from './Login';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: jest.fn(() => '/feed'),
}));

it('login success redirects to /home', async () => {
  jest.spyOn(axios, 'post').mockResolvedValue({ status: 200 } as any);
  const { container } = render(React.createElement(Login, { setIsOpenLogin: jest.fn() }));

  fireEvent.change(screen.getByPlaceholderText('Correo electronico'), { target: { value: 'a@a.com' } });
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '12345678' } });
  const form = container.querySelector('form')!;
  fireEvent.submit(form);

  await waitFor(() => expect(push).toHaveBeenCalledWith('/home'));
});

it('login error shows error message for email 404', async () => {
  const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, { status: 404, data: { error: 'not found' } } as any);
  jest.spyOn(axios, 'post').mockRejectedValue(err);

  const { container } = render(React.createElement(Login, { setIsOpenLogin: jest.fn() }));
  fireEvent.change(screen.getByPlaceholderText('Correo electronico'), { target: { value: 'a@a.com' } });
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '12345678' } });
  const form = container.querySelector('form')!;
  fireEvent.submit(form);

  await waitFor(() => {
    expect(screen.getByText('not found')).toBeInTheDocument();
  });
});

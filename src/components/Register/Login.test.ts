import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { authService } from '@/infrastructure/services/authService.service';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('@/infrastructure/services/authService.service', () => ({
  authService: { login: jest.fn() },
}));

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login success redirects to /home', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ success: true });
    render(React.createElement(Login, { onClose: jest.fn() }));

    fireEvent.change(screen.getByPlaceholderText('Correo electronico'), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/home'));
  });

  it('login error shows the backend error message', async () => {
    (authService.login as jest.Mock).mockResolvedValue({ success: false, error: 'not found' });
    render(React.createElement(Login, { onClose: jest.fn() }));

    fireEvent.change(screen.getByPlaceholderText('Correo electronico'), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByText('not found')).toBeInTheDocument();
    });
    expect(push).not.toHaveBeenCalled();
  });

  it('closes when clicking outside the modal box', () => {
    const onClose = jest.fn();
    render(
      React.createElement(
        'div',
        null,
        React.createElement(Login, { onClose }),
        React.createElement('div', { 'data-testid': 'outside' })
      )
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(onClose).toHaveBeenCalled();
  });
});

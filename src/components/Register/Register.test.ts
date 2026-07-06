import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import { authService } from '@/infrastructure/services/authService.service';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('@/infrastructure/services/authService.service', () => ({
  authService: { register: jest.fn() },
}));

describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the live password checklist as the user types', () => {
    render(React.createElement(Register, { onClose: jest.fn() }));

    const passwordInput = screen.getByPlaceholderText('Contraseña');
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(screen.getByText('Al menos 8 caracteres').closest('li')).toHaveClass('cumplida');
    expect(screen.getByText('Una letra mayúscula').closest('li')).toHaveClass('pendiente');
  });

  it('submits, auto-logs in and closes the modal on success', async () => {
    (authService.register as jest.Mock).mockResolvedValue({ success: true });
    const onClose = jest.fn();
    render(React.createElement(Register, { onClose }));

    fireEvent.change(screen.getByPlaceholderText('Nombre y apellido'), { target: { value: 'Lucas Cabral' } });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'lucas@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'Password1' } });

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(push).toHaveBeenCalledWith('/home');
  });

  it('closes when clicking outside the modal box', () => {
    const onClose = jest.fn();
    render(
      React.createElement(
        'div',
        null,
        React.createElement(Register, { onClose }),
        React.createElement('div', { 'data-testid': 'outside' })
      )
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(onClose).toHaveBeenCalled();
  });

  it('closes when pressing Escape', () => {
    const onClose = jest.fn();
    render(React.createElement(Register, { onClose }));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });
});

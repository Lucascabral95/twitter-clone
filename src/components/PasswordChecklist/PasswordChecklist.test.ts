import React from 'react';
import { render, screen } from '@testing-library/react';
import PasswordChecklist from './PasswordChecklist';

describe('PasswordChecklist', () => {
  it('marks all requirements as pending for an empty password', () => {
    render(React.createElement(PasswordChecklist, { password: '' }));

    expect(screen.getByText('Al menos 8 caracteres').closest('li')).toHaveClass('pendiente');
    expect(screen.getByText('Una letra mayúscula').closest('li')).toHaveClass('pendiente');
    expect(screen.getByText('Una letra minúscula').closest('li')).toHaveClass('pendiente');
    expect(screen.getByText('Un número').closest('li')).toHaveClass('pendiente');
  });

  it('marks requirements as satisfied as the password gets stronger', () => {
    render(React.createElement(PasswordChecklist, { password: 'Password1' }));

    expect(screen.getByText('Al menos 8 caracteres').closest('li')).toHaveClass('cumplida');
    expect(screen.getByText('Una letra mayúscula').closest('li')).toHaveClass('cumplida');
    expect(screen.getByText('Una letra minúscula').closest('li')).toHaveClass('cumplida');
    expect(screen.getByText('Un número').closest('li')).toHaveClass('cumplida');
  });

  it('reflects partial progress', () => {
    render(React.createElement(PasswordChecklist, { password: 'password' }));

    expect(screen.getByText('Al menos 8 caracteres').closest('li')).toHaveClass('cumplida');
    expect(screen.getByText('Una letra minúscula').closest('li')).toHaveClass('cumplida');
    expect(screen.getByText('Una letra mayúscula').closest('li')).toHaveClass('pendiente');
    expect(screen.getByText('Un número').closest('li')).toHaveClass('pendiente');
  });
});

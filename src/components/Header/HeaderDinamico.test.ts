import React from 'react';
import { render, screen } from '@testing-library/react';
import HeaderDinamico from './HeaderDinamico';
import { useProfileData } from '@/presentation/hooks/useProfileData';

jest.mock('@/presentation/hooks/useProfileData', () => ({
  useProfileData: jest.fn(),
}));

const profile = {
  usuario: { id: 1, nombre: 'Nombre', email: 'a@a.com', fecha_creacion: '2024-01-01', identificador: '' },
  datosPersonales: { id: 1, biografia: 'Bio', cumpleanos: '2000-01-01', localizacion: '', sitio_web: '', usuario_id: 1, created_at: '', updated_at: '' },
  stats: { seguidos: 2, seguidores: 3 },
  relacion: { viewerId: 2, esMiPerfil: false, loSigo: true },
};

beforeEach(() => {
  jest.clearAllMocks();
  (useProfileData as jest.Mock).mockReturnValue({
    profile,
    loading: false,
    error: undefined,
    mutateProfile: jest.fn(),
  });
});

test('renders dynamic header with profile data and stats', () => {
  render(React.createElement(HeaderDinamico, { id: 1 }));

  expect(screen.getByText('Nombre')).toBeInTheDocument();
  expect(screen.getByText('Bio')).toBeInTheDocument();
  expect(screen.getByText(/2 seguido/)).toBeInTheDocument();
  expect(screen.getByText(/3 seguidor/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Dejar de seguir' })).toBeInTheDocument();
});

test('does not render stale placeholders while profile is loading', () => {
  (useProfileData as jest.Mock).mockReturnValue({
    profile: undefined,
    loading: true,
    error: undefined,
    mutateProfile: jest.fn(),
  });

  const { container } = render(React.createElement(HeaderDinamico, { id: 1 }));

  expect(container).toBeEmptyDOMElement();
  expect(screen.queryByText(/0 seguido/)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Seguir' })).not.toBeInTheDocument();
});

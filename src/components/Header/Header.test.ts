import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { useProfileData } from '@/presentation/hooks/useProfileData';

jest.mock('@/presentation/hooks/useProfileData', () => ({
  useProfileData: jest.fn(),
}));

const dataUser = { id: 1, nombre: 'Nombre', email: 'a@a.com', fecha_creacion: '2024-01-01', identificador: '', exp: 0, iat: 0 } as any;
const misDatosPersonales = { biografia: 'Bio', created_at: '', cumpleanos: '2000-01-01', id: 1, localizacion: '', sitio_web: '', updated_at: '', usuario_id: 1 } as any;
const profile = {
  usuario: { id: 1, nombre: 'Nombre', email: 'a@a.com', fecha_creacion: '2024-01-01', identificador: '' },
  datosPersonales: { id: 1, biografia: 'Bio', cumpleanos: '2000-01-01', localizacion: '', sitio_web: '', usuario_id: 1, created_at: '', updated_at: '' },
  stats: { seguidos: 2, seguidores: 3 },
  relacion: { viewerId: 1, esMiPerfil: true, loSigo: false },
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

it('renders user name, bio and profile stats', () => {
  render(React.createElement(Header, { dataUser, misDatosPersonales, seguidores: [], seguidos: [] }));

  expect(screen.getByText('Nombre')).toBeInTheDocument();
  expect(screen.getByText('Bio')).toBeInTheDocument();
  expect(screen.getByText(/2 seguido/)).toBeInTheDocument();
  expect(screen.getByText(/3 seguidor/)).toBeInTheDocument();
});

it('does not render zero counts before the profile payload is loaded', () => {
  (useProfileData as jest.Mock).mockReturnValue({
    profile: undefined,
    loading: true,
    error: undefined,
    mutateProfile: jest.fn(),
  });

  render(React.createElement(Header, { dataUser, misDatosPersonales, seguidores: [], seguidos: [] }));

  expect(screen.queryByText(/0 seguido/)).not.toBeInTheDocument();
  expect(screen.queryByText(/0 seguidor/)).not.toBeInTheDocument();
});

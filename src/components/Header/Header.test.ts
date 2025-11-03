import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

const dataUser = { id:1, nombre:'Nombre', email:'a@a.com', fecha_creacion:'2024-01-01', identificador:'', exp:0, iat:0 } as any;
const misDatosPersonales = { biografia:'Bio', created_at:'', cumpleanos:'2000-01-01', id:1, localizacion:'', sitio_web:'', updated_at:'', usuario_id:1 } as any;

it('renders user name and bio', () => {
  render(React.createElement(Header, { dataUser, misDatosPersonales, seguidores: [], seguidos: [] }));
  expect(screen.getByText('Nombre')).toBeInTheDocument();
  expect(screen.getByText('Bio')).toBeInTheDocument();
});

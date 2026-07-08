import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SobreMi from './SobreMi';
import axios from 'axios';
import * as DatosPersonales from '@/utils/functions/DatosPersonales';

jest.mock('@/utils/functions/DatosPersonales', () => ({
  guardarDatos: jest.fn(),
}));

it('renders form fields and submits', async () => {
  jest.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: { result: [{ biografia:'', localizacion:'', sitio_web:'', cumpleanos:'' }] } } as any);
  render(React.createElement(SobreMi, { id: 1, editable: true } as any));

  expect(await screen.findByLabelText('Biografía')).toBeInTheDocument();
  expect(await screen.findByLabelText('Localización')).toBeInTheDocument();
  expect(await screen.findByLabelText('Sitio web')).toBeInTheDocument();
  expect(await screen.findByLabelText('Cumpleaños')).toBeInTheDocument();

  const btn = await screen.findByRole('button', { name: /Actualizar|Guardar/ });
  fireEvent.click(btn);
  expect((DatosPersonales as any).guardarDatos).toHaveBeenCalled();
});

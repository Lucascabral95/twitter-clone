const fixedRow = {
  id: 1,
  biografia: 'Bio',
  localizacion: 'Buenos Aires',
  sitio_web: 'https://example.com',
  cumpleanos: '2000-01-01',
  usuario_id: 54,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

const mockSql = jest.fn(async () => [fixedRow]);

jest.mock('@/services/neon', () => ({
  __esModule: true,
  default: jest.fn(async () => mockSql),
}));

import DAODatosPersonales from './DAODatosPersonales';

describe('DAODatosPersonales', () => {
  beforeEach(() => {
    mockSql.mockClear();
    mockSql.mockImplementation(async () => [fixedRow]);
  });

  it('getDatosPersonalesByID throws on NaN', async () => {
    await expect(DAODatosPersonales.getDatosPersonalesByID(Number('x'))).rejects.toMatchObject({ status: 400 });
  });

  it('getDatosPersonalesByID returns an empty array when the user has no profile data', async () => {
    mockSql.mockResolvedValueOnce([]);

    await expect(DAODatosPersonales.getDatosPersonalesByID(54)).resolves.toEqual([]);
  });

  it('getDatosPersonalesByID returns profile data when it exists', async () => {
    await expect(DAODatosPersonales.getDatosPersonalesByID(54)).resolves.toEqual([fixedRow]);
  });

  it('updateDatosPersonalesById throws on NaN', async () => {
    await expect(DAODatosPersonales.updateDatosPersonalesById(Number('x'), {} as any)).rejects.toMatchObject({ status: 400 });
  });
});
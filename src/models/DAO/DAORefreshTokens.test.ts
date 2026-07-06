const fixedRow = {
  id: 'uuid-1',
  user_id: 5,
  token_hash: 'hash-1',
  expira: '2030-01-01T00:00:00.000Z',
  revocado: false,
  creado: '2024-01-01T00:00:00.000Z',
};

const mockSql = jest.fn(async (_strings: readonly string[], ..._values: unknown[]) => [fixedRow]);

jest.mock('@/services/neon', () => ({
  __esModule: true,
  default: jest.fn(async () => mockSql),
}));

import DAORefreshTokens from './DAORefreshTokens';

describe('DAORefreshTokens', () => {
  beforeEach(() => {
    mockSql.mockClear();
  });

  it('crear inserta y devuelve la fila creada', async () => {
    const result = await DAORefreshTokens.crear(5, 'hash-1', new Date('2030-01-01'));

    expect(result).toEqual(fixedRow);
    const [strings, ...values] = mockSql.mock.calls[0];
    expect(strings.join('')).toContain('insert into refresh_tokens');
    expect(values).toContain(5);
    expect(values).toContain('hash-1');
  });

  it('buscarPorHash retorna la fila cuando existe', async () => {
    const result = await DAORefreshTokens.buscarPorHash('hash-1');

    expect(result).toEqual(fixedRow);
  });

  it('buscarPorHash retorna null cuando no hay coincidencias', async () => {
    mockSql.mockResolvedValueOnce([]);

    const result = await DAORefreshTokens.buscarPorHash('no-existe');

    expect(result).toBeNull();
  });

  it('revocar actualiza el registro por id', async () => {
    await DAORefreshTokens.revocar('uuid-1');

    const [strings, ...values] = mockSql.mock.calls[0];
    expect(strings.join('')).toContain('update refresh_tokens set revocado = true');
    expect(values).toContain('uuid-1');
  });

  it('revocarTodosDelUsuario actualiza todos los registros del usuario', async () => {
    await DAORefreshTokens.revocarTodosDelUsuario(5);

    const [strings, ...values] = mockSql.mock.calls[0];
    expect(strings.join('')).toContain('where user_id');
    expect(values).toContain(5);
  });
});

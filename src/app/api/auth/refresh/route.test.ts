/**
 * @jest-environment node
 */

const store: Record<string, { value: string }> = {};
const mockCookieStore = {
  get: jest.fn((name: string) => store[name]),
  set: jest.fn((name: string, value: string) => {
    store[name] = { value };
  }),
  delete: jest.fn((name: string) => {
    delete store[name];
  }),
};

jest.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

jest.mock('@/models/DAO/DAOUsuarios', () => ({
  __esModule: true,
  default: { getUserByIdentificador: jest.fn() },
}));

jest.mock('@/models/DAO/DAORefreshTokens', () => ({
  __esModule: true,
  default: {
    buscarPorHash: jest.fn(),
    revocar: jest.fn(),
    crear: jest.fn(),
  },
}));

import { POST } from './route';
import DAOUsuarios from '@/models/DAO/DAOUsuarios';
import DAORefreshTokens from '@/models/DAO/DAORefreshTokens';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/infrastructure/auth/constants';

const mockGetUser = DAOUsuarios.getUserByIdentificador as jest.Mock;
const mockBuscarPorHash = DAORefreshTokens.buscarPorHash as jest.Mock;
const mockRevocar = DAORefreshTokens.revocar as jest.Mock;
const mockCrear = DAORefreshTokens.crear as jest.Mock;

describe('/api/auth/refresh route', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    Object.keys(store).forEach(key => delete store[key]);
    jest.clearAllMocks();
  });

  it('returns 401 when there is no refresh cookie', async () => {
    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe('No autorizado');
  });

  it('returns 401 and clears cookies when the refresh token is unknown', async () => {
    store[REFRESH_COOKIE] = { value: 'unknown-token' };
    mockBuscarPorHash.mockResolvedValue(null);

    const response = await POST();

    expect(response.status).toBe(401);
    expect(mockCookieStore.delete).toHaveBeenCalledWith(ACCESS_COOKIE);
    expect(mockCookieStore.delete).toHaveBeenCalledWith(REFRESH_COOKIE);
  });

  it('returns 401 when the stored token is revoked', async () => {
    store[REFRESH_COOKIE] = { value: 'revoked-token' };
    mockBuscarPorHash.mockResolvedValue({
      id: 'row-1',
      user_id: 1,
      token_hash: 'x',
      expira: '2999-01-01',
      revocado: true,
      creado: '2024-01-01',
    });

    const response = await POST();

    expect(response.status).toBe(401);
  });

  it('returns 401 when the stored token is expired', async () => {
    store[REFRESH_COOKIE] = { value: 'expired-token' };
    mockBuscarPorHash.mockResolvedValue({
      id: 'row-1',
      user_id: 1,
      token_hash: 'x',
      expira: '2000-01-01',
      revocado: false,
      creado: '2024-01-01',
    });

    const response = await POST();

    expect(response.status).toBe(401);
  });

  it('rotates the refresh token and reissues the access token on success', async () => {
    store[REFRESH_COOKIE] = { value: 'valid-token' };
    mockBuscarPorHash.mockResolvedValue({
      id: 'row-1',
      user_id: 7,
      token_hash: 'x',
      expira: '2999-01-01',
      revocado: false,
      creado: '2024-01-01',
    });
    mockGetUser.mockResolvedValue({
      id: 7,
      nombre: 'Ana',
      email: 'ana@example.com',
      identificador: 'uuid-7',
      fecha_creacion: '2024-01-01',
    });

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.result).toBe('Sesion renovada');
    expect(mockRevocar).toHaveBeenCalledWith('row-1');
    expect(mockCrear).toHaveBeenCalledWith(7, expect.any(String), expect.any(Date));
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      ACCESS_COOKIE,
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      REFRESH_COOKIE,
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );
  });
});

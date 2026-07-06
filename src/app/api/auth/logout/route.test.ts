/**
 * @jest-environment node
 */

const store: Record<string, { value: string }> = {};
const mockCookieStore = {
  get: jest.fn((name: string) => store[name]),
  delete: jest.fn((name: string) => {
    delete store[name];
  }),
};

jest.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

jest.mock('@/models/DAO/DAORefreshTokens', () => ({
  __esModule: true,
  default: {
    buscarPorHash: jest.fn(),
    revocar: jest.fn(),
  },
}));

import { GET } from './route';
import DAORefreshTokens from '@/models/DAO/DAORefreshTokens';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/infrastructure/auth/constants';

const mockBuscarPorHash = DAORefreshTokens.buscarPorHash as jest.Mock;
const mockRevocar = DAORefreshTokens.revocar as jest.Mock;

describe('/api/auth/logout route', () => {
  beforeEach(() => {
    Object.keys(store).forEach(key => delete store[key]);
    jest.clearAllMocks();
  });

  it('clears both cookies even without an existing refresh token', async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.result).toBe('Sesion cerrada');
    expect(mockBuscarPorHash).not.toHaveBeenCalled();
    expect(mockCookieStore.delete).toHaveBeenCalledWith(ACCESS_COOKIE);
    expect(mockCookieStore.delete).toHaveBeenCalledWith(REFRESH_COOKIE);
  });

  it('revokes the stored refresh token in the DB when present', async () => {
    store[REFRESH_COOKIE] = { value: 'a-refresh-token' };
    mockBuscarPorHash.mockResolvedValue({ id: 'row-1' });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(mockRevocar).toHaveBeenCalledWith('row-1');
    expect(mockCookieStore.delete).toHaveBeenCalledWith(ACCESS_COOKIE);
    expect(mockCookieStore.delete).toHaveBeenCalledWith(REFRESH_COOKIE);
  });
});

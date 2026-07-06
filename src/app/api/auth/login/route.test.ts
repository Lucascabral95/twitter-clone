/**
 * @jest-environment node
 */

const mockCookieStore = {
  set: jest.fn(),
};

jest.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

jest.mock('@/models/DAO/DAOUsuarios', () => ({
  __esModule: true,
  default: {
    loginUser: jest.fn(),
  },
}));

jest.mock('@/models/DAO/DAORefreshTokens', () => ({
  __esModule: true,
  default: {
    crear: jest.fn(),
  },
}));

import { NextRequest } from 'next/server';
import { POST } from './route';
import DAOUsuarios from '@/models/DAO/DAOUsuarios';
import DAORefreshTokens from '@/models/DAO/DAORefreshTokens';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/infrastructure/auth/constants';

const mockLoginUser = DAOUsuarios.loginUser as jest.Mock;
const mockCrear = DAORefreshTokens.crear as jest.Mock;

describe('/api/auth/login route', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    mockCookieStore.set.mockReset();
    mockLoginUser.mockReset();
    mockCrear.mockReset();
  });

  it('returns 400 when email or password are missing', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: '', password: '' }),
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Faltan datos');
    expect(mockLoginUser).not.toHaveBeenCalled();
  });

  it('returns 401 when the DAO rejects with invalid credentials', async () => {
    mockLoginUser.mockRejectedValue({ error: 'Contraseña incorrecta', status: 401 });
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'ana@example.com', password: 'wrong' }),
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe('Contraseña incorrecta');
    expect(mockCookieStore.set).not.toHaveBeenCalled();
  });

  it('sets access and refresh cookies and persists the refresh token on successful login', async () => {
    mockLoginUser.mockResolvedValue({
      result: 'Acceso permitido',
      usuario: {
        id: 1,
        nombre: 'Ana',
        email: 'ana@example.com',
        identificador: 'uuid-1',
        fecha_creacion: '2024-01-01',
      },
    });
    mockCrear.mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'ANA@example.com', password: 'right' }),
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.result).toBe('Acceso permitido');
    expect(mockLoginUser).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'right' });
    expect(mockCrear).toHaveBeenCalledWith(1, expect.any(String), expect.any(Date));
    expect(mockCookieStore.set).toHaveBeenCalledTimes(2);

    const cookieNames = mockCookieStore.set.mock.calls.map(call => call[0]);
    expect(cookieNames).toEqual(expect.arrayContaining([ACCESS_COOKIE, REFRESH_COOKIE]));

    for (const [, , options] of mockCookieStore.set.mock.calls) {
      expect(options).toMatchObject({ httpOnly: true, sameSite: 'strict', path: '/' });
    }
  });
});

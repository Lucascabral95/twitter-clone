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
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
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

const mockCreateUser = DAOUsuarios.createUser as jest.Mock;
const mockCrear = DAORefreshTokens.crear as jest.Mock;

describe('/api/auth/register route', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    mockCookieStore.set.mockReset();
    mockCreateUser.mockReset();
    mockCrear.mockReset();
  });

  it('returns 400 when required fields are missing', async () => {
    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre: '', email: '', password: '' }),
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.result).toBe('Faltan datos');
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it('returns the DAO error when the email is already registered', async () => {
    mockCreateUser.mockRejectedValue({ error: 'El usuario ya se encuentra registrado', status: 404 });

    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Ana Perez', email: 'ana@example.com', password: 'Password1' }),
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe('El usuario ya se encuentra registrado');
    expect(mockCookieStore.set).not.toHaveBeenCalled();
  });

  it('auto-logs in the new user: creates the account and sets access + refresh cookies', async () => {
    mockCreateUser.mockResolvedValue({
      id: 1,
      nombre: 'Ana Perez',
      email: 'ana@example.com',
      identificador: 'uuid-1',
      fecha_creacion: '2024-01-01',
    });
    mockCrear.mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Ana Perez', email: 'ANA@example.com', password: 'Password1' }),
    });

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.result).toMatchObject({ id: 1, email: 'ana@example.com' });
    expect(mockCrear).toHaveBeenCalledWith(1, expect.any(String), expect.any(Date));

    const cookieNames = mockCookieStore.set.mock.calls.map(call => call[0]);
    expect(cookieNames).toEqual(expect.arrayContaining([ACCESS_COOKIE, REFRESH_COOKIE]));
  });
});

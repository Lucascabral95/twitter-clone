/**
 * @jest-environment node
 */

const mockCookieStore = {
  get: jest.fn(),
};

jest.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

import { signSession, getSessionUser, SessionPayload } from './session';

describe('session contract (signSession <-> getSessionUser)', () => {
  const payload: SessionPayload = {
    id: 1,
    email: 'ana@example.com',
    nombre: 'Ana',
    identificador: 'uuid-1',
    fecha_creacion: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    mockCookieStore.get.mockReset();
  });

  it('round-trips a signed payload through the session cookie', async () => {
    const token = await signSession(payload);
    mockCookieStore.get.mockReturnValue({ value: token });

    const result = await getSessionUser();

    expect(result).toMatchObject(payload);
  });

  it('returns null when there is no session cookie', async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getSessionUser();

    expect(result).toBeNull();
  });

  it('returns null for a tampered token', async () => {
    const token = await signSession(payload);
    mockCookieStore.get.mockReturnValue({ value: `${token}tampered` });

    const result = await getSessionUser();

    expect(result).toBeNull();
  });

  it('returns null when the token was signed with a different secret', async () => {
    const token = await signSession(payload);
    process.env.JWT_SECRET = 'a-different-secret';
    mockCookieStore.get.mockReturnValue({ value: token });

    const result = await getSessionUser();

    expect(result).toBeNull();
  });
});

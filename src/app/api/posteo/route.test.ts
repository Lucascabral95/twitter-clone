/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

const fixedRows = [
  {
    id: 1,
    nombre: 'Ana',
    email: 'ana@example.com',
    fecha_creacion: '2024-01-01',
    identificador: 'uuid-1',
    posteo_id: 1,
    titulo: 'Hola',
    contenido: 'Mundo',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    creador_id: 42,
    likes: 0,
  },
];

const mockSql = jest.fn(async (_strings: readonly string[], ..._values: unknown[]) => fixedRows);

jest.mock('@/services/neon', () => ({
  __esModule: true,
  default: jest.fn(async () => mockSql),
}));

jest.mock('@/infrastructure/auth/session', () => ({
  getSessionUser: jest.fn(),
}));

import { GET, POST } from './route';
import { getSessionUser } from '@/infrastructure/auth/session';

const mockGetSessionUser = getSessionUser as jest.Mock;

describe('/api/posteo route', () => {
  beforeEach(() => {
    mockSql.mockClear();
    mockGetSessionUser.mockReset();
  });

  describe('GET', () => {
    it('fetches all posteos when there are no query params', async () => {
      const req = new NextRequest('http://localhost/api/posteo');

      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.result).toEqual(fixedRows);
      expect(body.pagination).toEqual({ limit: 20, nextCursor: null, hasMore: false });
      const [strings, ...values] = mockSql.mock.calls[0];
      expect(strings.join('')).toContain('order by posteo_id desc');
      expect(values).toContain(21); // limit + 1
    });

    it('paginates with cursor and reports hasMore/nextCursor when there is a next page', async () => {
      const page = Array.from({ length: 3 }, (_, i) => ({ ...fixedRows[0], posteo_id: 10 - i }));
      mockSql.mockResolvedValueOnce(page);

      const req = new NextRequest('http://localhost/api/posteo?limit=2&cursor=15');

      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.result).toHaveLength(2);
      expect(body.pagination).toEqual({ limit: 2, nextCursor: 9, hasMore: true });
      const [strings, ...values] = mockSql.mock.calls[0];
      expect(strings.join('')).toContain('posteo_id <');
      expect(values).toContain(15);
      expect(values).toContain(3); // limit + 1
    });

    it('clamps limit to the maximum allowed', async () => {
      const req = new NextRequest('http://localhost/api/posteo?limit=9999');

      const response = await GET(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.pagination.limit).toBe(50);
    });

    it('filters by creador_id when present', async () => {
      const req = new NextRequest('http://localhost/api/posteo?creador_id=42');

      const response = await GET(req);

      expect(response.status).toBe(200);
      const [strings, ...values] = mockSql.mock.calls[0];
      expect(strings.join('')).toContain('where creador_id');
      expect(values).toContain(42);
    });

    it('searches by q when present, taking precedence over creador_id', async () => {
      const req = new NextRequest('http://localhost/api/posteo?q=hola&creador_id=42');

      const response = await GET(req);

      expect(response.status).toBe(200);
      const [strings, ...values] = mockSql.mock.calls[0];
      expect(strings.join('')).toContain('ILIKE');
      expect(values).toContain('%hola%');
    });
  });

  describe('POST', () => {
    it('rejects requests without a session', async () => {
      mockGetSessionUser.mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/posteo', {
        method: 'POST',
        body: JSON.stringify({ titulo: 't', contenido: 'c' }),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('No autorizado');
      expect(mockSql).not.toHaveBeenCalled();
    });

    it('creates a posteo using the session user id, ignoring any creador_id sent in the body', async () => {
      mockGetSessionUser.mockResolvedValue({
        id: 99,
        email: 'x@x.com',
        nombre: 'X',
        identificador: 'uuid',
        fecha_creacion: '2024-01-01',
      });
      const req = new NextRequest('http://localhost/api/posteo', {
        method: 'POST',
        body: JSON.stringify({ titulo: 't', contenido: 'c', creador_id: 1 }),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.result).toEqual(fixedRows[0]);
      const [, ...values] = mockSql.mock.calls[0];
      expect(values).toContain(99);
      expect(values).not.toContain(1);
    });
  });
});

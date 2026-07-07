/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

const fixedPosteo = {
  id: 7,
  nombre: 'Ana',
  email: 'ana@example.com',
  fecha_creacion: '2024-01-01',
  identificador: 'uuid-1',
  posteo_id: 7,
  titulo: 'Hola',
  contenido: 'Mundo',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  creador_id: 42,
  likes: 0,
  comentarios_count: 0,
  reposteos_count: 0,
};

const mockSql = jest.fn(async (): Promise<any[]> => [fixedPosteo]);

jest.mock('@/services/neon', () => ({
  __esModule: true,
  default: jest.fn(async () => mockSql),
}));

jest.mock('@/infrastructure/auth/session', () => ({
  getSessionUser: jest.fn(),
}));

jest.mock('@/services/cloudinary', () => ({
  __esModule: true,
  default: {
    uploader: {
      destroy: jest.fn(() => Promise.resolve({ result: 'ok' })),
    },
  },
  ensureCloudinaryConfigured: jest.fn(),
}));

import { PUT, PATCH, DELETE } from './route';
import { getSessionUser } from '@/infrastructure/auth/session';
import cloudinary, { ensureCloudinaryConfigured } from '@/services/cloudinary';

const mockGetSessionUser = getSessionUser as jest.Mock;
const mockDestroy = cloudinary.uploader.destroy as jest.Mock;
const mockEnsureCloudinaryConfigured = ensureCloudinaryConfigured as jest.Mock;

describe('/api/posteo/[id] route', () => {
  beforeEach(() => {
    mockSql.mockClear();
    mockSql.mockImplementation(async () => [fixedPosteo]);
    mockGetSessionUser.mockReset();
    mockDestroy.mockClear();
    mockEnsureCloudinaryConfigured.mockClear();
  });

  describe('PUT (toggle like)', () => {
    it('rejects requests without a session', async () => {
      mockGetSessionUser.mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/posteo/7', { method: 'PUT' });

      const response = await PUT(req, { params: { id: 7 } });

      expect(response.status).toBe(401);
    });

    it('likes the post when not previously liked', async () => {
      mockGetSessionUser.mockResolvedValue({ id: 42 });
      mockSql
        .mockResolvedValueOnce([{ usuario_id: 42, posteo_id: 7 }])
        .mockResolvedValueOnce([{ likes: 1 }]);

      const req = new NextRequest('http://localhost/api/posteo/7', { method: 'PUT' });
      const response = await PUT(req, { params: { id: 7 } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.result).toEqual({ liked: true, likes: 1, creador_id: null });
    });

    it('unlikes the post when already liked', async () => {
      mockGetSessionUser.mockResolvedValue({ id: 42 });
      mockSql
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ likes: 0 }]);

      const req = new NextRequest('http://localhost/api/posteo/7', { method: 'PUT' });
      const response = await PUT(req, { params: { id: 7 } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.result).toEqual({ liked: false, likes: 0, creador_id: null });
    });
  });

  describe('PATCH', () => {
    it('rejects requests without a session', async () => {
      mockGetSessionUser.mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/posteo/7', {
        method: 'PATCH',
        body: JSON.stringify({ titulo: 't' }),
      });

      const response = await PATCH(req, { params: { id: 7 } });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.error).toBe('No autorizado');
    });

    it('rejects editing a post owned by another user', async () => {
      mockGetSessionUser.mockResolvedValue({ id: 999 });
      const req = new NextRequest('http://localhost/api/posteo/7', {
        method: 'PATCH',
        body: JSON.stringify({ titulo: 't' }),
      });

      const response = await PATCH(req, { params: { id: 7 } });
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.error).toBe('No podés editar el posteo de otro usuario');
    });

    it('updates the post when the session user owns it', async () => {
      mockGetSessionUser.mockResolvedValue({ id: 42 });
      const req = new NextRequest('http://localhost/api/posteo/7', {
        method: 'PATCH',
        body: JSON.stringify({ titulo: 'Nuevo', contenido: 'Contenido nuevo' }),
      });

      const response = await PATCH(req, { params: { id: 7 } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.result).toEqual(fixedPosteo);
    });
  });

  describe('DELETE', () => {
    it('rejects requests without a session', async () => {
      mockGetSessionUser.mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/posteo/7', { method: 'DELETE' });

      const response = await DELETE(req, { params: { id: 7 } });

      expect(response.status).toBe(401);
    });

    it('rejects deleting a post owned by another user', async () => {
      mockGetSessionUser.mockResolvedValue({ id: 999 });
      const req = new NextRequest('http://localhost/api/posteo/7', { method: 'DELETE' });

      const response = await DELETE(req, { params: { id: 7 } });
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.error).toBe('No podés borrar el posteo de otro usuario');
    });

    it('deletes the post when the session user owns it', async () => {
      mockGetSessionUser.mockResolvedValue({ id: 42 });
      const req = new NextRequest('http://localhost/api/posteo/7', { method: 'DELETE' });

      const response = await DELETE(req, { params: { id: 7 } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.result).toEqual(fixedPosteo);
      expect(mockDestroy).not.toHaveBeenCalled();
    });

    it('deletes the Cloudinary asset when the post has an image_public_id', async () => {
      mockGetSessionUser.mockResolvedValue({ id: 42 });
      const posteoConImagen = { ...fixedPosteo, imagen_public_id: 'twitter-clone/posteos/42/abc' };
      mockSql.mockImplementation(async () => [posteoConImagen]);
      const req = new NextRequest('http://localhost/api/posteo/7', { method: 'DELETE' });

      const response = await DELETE(req, { params: { id: 7 } });

      expect(response.status).toBe(200);
      expect(mockEnsureCloudinaryConfigured).toHaveBeenCalledTimes(1);
      expect(mockDestroy).toHaveBeenCalledWith('twitter-clone/posteos/42/abc');
    });
  });
});



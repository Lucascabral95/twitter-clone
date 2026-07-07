/**
 * @jest-environment node
 */

jest.mock('@/services/cloudinary', () => ({
  __esModule: true,
  default: {
    utils: {
      api_sign_request: jest.fn(() => 'firma-simulada'),
    },
  },
  ensureCloudinaryConfigured: jest.fn(() => ({
    apiKey: 'api-key',
    apiSecret: 'api-secret',
    cloudName: 'demo',
  })),
  POSTEOS_IMAGENES_FOLDER: 'twitter-clone/posteos',
}));

jest.mock('@/infrastructure/auth/session', () => ({
  getSessionUser: jest.fn(),
}));

import { GET } from './route';
import { getSessionUser } from '@/infrastructure/auth/session';
import cloudinary, { ensureCloudinaryConfigured } from '@/services/cloudinary';

const mockGetSessionUser = getSessionUser as jest.Mock;
const mockSignRequest = cloudinary.utils.api_sign_request as jest.Mock;
const mockEnsureCloudinaryConfigured = ensureCloudinaryConfigured as jest.Mock;

describe('/api/media/firma route', () => {
  beforeEach(() => {
    mockGetSessionUser.mockReset();
    mockSignRequest.mockClear();
    mockEnsureCloudinaryConfigured.mockClear();
  });

  it('rejects requests without a session', async () => {
    mockGetSessionUser.mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe('No autorizado');
    expect(mockSignRequest).not.toHaveBeenCalled();
  });

  it('signs a folder scoped to the session user and disables cache', async () => {
    mockGetSessionUser.mockResolvedValue({
      id: 42,
      email: 'x@x.com',
      nombre: 'X',
      identificador: 'uuid',
      fecha_creacion: '2024-01-01',
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(body.result.folder).toBe('twitter-clone/posteos/42');
    expect(body.result.apiKey).toBe('api-key');
    expect(body.result.cloudName).toBe('demo');
    expect(body.result.signature).toBe('firma-simulada');
    expect(mockEnsureCloudinaryConfigured).toHaveBeenCalledTimes(1);
    expect(mockSignRequest).toHaveBeenCalledWith(
      expect.objectContaining({ folder: 'twitter-clone/posteos/42' }),
      'api-secret'
    );
  });
});

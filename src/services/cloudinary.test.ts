import { esImagenCloudinaryValida, POSTEOS_IMAGENES_FOLDER } from './cloudinary';

describe('esImagenCloudinaryValida', () => {
  const userId = 42;
  const publicId = `${POSTEOS_IMAGENES_FOLDER}/${userId}/abc123`;
  const url = 'https://res.cloudinary.com/demo/image/upload/v1/twitter-clone/posteos/42/abc123.webp';

  beforeEach(() => {
    process.env.CLOUDINARY_CLOUD_NAME = 'demo';
    process.env.CLOUDINARY_API_KEY = 'key';
    process.env.CLOUDINARY_API_SECRET = 'secret';
  });

  it('acepta una url y public_id de Cloudinary dentro de la carpeta del usuario', () => {
    expect(esImagenCloudinaryValida(url, publicId, userId)).toBe(true);
  });

  it('rechaza una url que no es de Cloudinary', () => {
    expect(esImagenCloudinaryValida('https://evil.com/img.png', publicId, userId)).toBe(false);
  });

  it('rechaza una url de otro cloud name', () => {
    expect(
      esImagenCloudinaryValida(
        'https://res.cloudinary.com/otro/image/upload/v1/twitter-clone/posteos/42/abc123.webp',
        publicId,
        userId
      )
    ).toBe(false);
  });

  it('rechaza una url que no coincide con el public_id', () => {
    expect(
      esImagenCloudinaryValida(
        'https://res.cloudinary.com/demo/image/upload/v1/twitter-clone/posteos/42/otro.webp',
        publicId,
        userId
      )
    ).toBe(false);
  });

  it('rechaza un public_id fuera de la carpeta del usuario', () => {
    const publicIdDeOtroUsuario = `${POSTEOS_IMAGENES_FOLDER}/999/abc123`;
    expect(esImagenCloudinaryValida(url, publicIdDeOtroUsuario, userId)).toBe(false);
  });
});

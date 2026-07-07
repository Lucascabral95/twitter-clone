import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import { useImageUpload } from './useImageUpload';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const FAKE_BLOB = new Blob(['comprimida'], { type: 'image/webp' });

beforeAll(() => {
  (global as any).createImageBitmap = jest.fn(async () => ({ width: 2000, height: 1000, close: jest.fn() }));
  URL.createObjectURL = jest.fn(() => 'blob:preview-url');
  URL.revokeObjectURL = jest.fn();

  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    drawImage: jest.fn(),
  } as unknown as CanvasRenderingContext2D);

  jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
    callback?.(FAKE_BLOB);
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

function crearArchivo(nombre: string, tipo: string, tamanioBytes: number): File {
  return new File([new Uint8Array(tamanioBytes)], nombre, { type: tipo });
}

describe('useImageUpload', () => {
  it('rechaza un tipo de archivo no soportado', async () => {
    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.pdf', 'application/pdf', 1000));
    });

    expect(result.current.error).toMatch(/Formato no soportado/);
    expect(result.current.preview).toBeNull();
  });

  it('rechaza un archivo mas pesado que el limite', async () => {
    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.jpg', 'image/jpeg', 6 * 1024 * 1024));
    });

    expect(result.current.error).toMatch(/no puede pesar mas de 5 MB/);
    expect(result.current.preview).toBeNull();
  });

  it('limpia la imagen previa si el usuario selecciona un archivo invalido', async () => {
    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.jpg', 'image/jpeg', 1000));
    });

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.pdf', 'application/pdf', 1000));
    });

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview-url');
    expect(result.current.preview).toBeNull();
    expect(result.current.error).toMatch(/Formato no soportado/);
  });

  it('acepta y comprime una imagen valida, generando preview', async () => {
    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.jpg', 'image/jpeg', 1000));
    });

    expect(result.current.error).toBeNull();
    expect(result.current.preview).toBe('blob:preview-url');
  });

  it('subir() devuelve null si no hay imagen seleccionada', async () => {
    const { result } = renderHook(() => useImageUpload());

    let subida;
    await act(async () => {
      subida = await result.current.subir();
    });

    expect(subida).toBeNull();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('subir() pide firma y sube la imagen a Cloudinary', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        result: {
          timestamp: 123,
          signature: 'firma',
          folder: 'twitter-clone/posteos/1',
          apiKey: 'key',
          cloudName: 'demo',
        },
      },
    });
    mockedAxios.post.mockResolvedValue({
      data: { secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/twitter-clone/posteos/1/x.webp', public_id: 'twitter-clone/posteos/1/x' },
    });

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.jpg', 'image/jpeg', 1000));
    });

    let subida;
    await act(async () => {
      subida = await result.current.subir();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/media/firma');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.cloudinary.com/v1_1/demo/image/upload',
      expect.any(FormData),
      expect.any(Object)
    );
    expect(subida).toEqual({
      imagen_url: 'https://res.cloudinary.com/demo/image/upload/v1/twitter-clone/posteos/1/x.webp',
      imagen_public_id: 'twitter-clone/posteos/1/x',
    });
  });

  it('subir() reutiliza la promesa si se llama dos veces durante la misma subida', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { result: { timestamp: 123, signature: 'firma', folder: 'twitter-clone/posteos/1', apiKey: 'key', cloudName: 'demo' } },
    });
    mockedAxios.post.mockResolvedValue({
      data: { secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/twitter-clone/posteos/1/x.webp', public_id: 'twitter-clone/posteos/1/x' },
    });

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.jpg', 'image/jpeg', 1000));
    });

    await act(async () => {
      await Promise.all([result.current.subir(), result.current.subir()]);
    });

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  it('subir() setea error y devuelve null si falla la subida', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.jpg', 'image/jpeg', 1000));
    });

    let subida;
    await act(async () => {
      subida = await result.current.subir();
    });

    expect(subida).toBeNull();
    expect(result.current.error).toMatch(/No se pudo subir/);
  });

  it('limpiar() resetea preview y error', async () => {
    const { result } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.jpg', 'image/jpeg', 1000));
    });

    act(() => {
      result.current.limpiar();
    });

    expect(result.current.preview).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('revoca la preview al desmontar', async () => {
    const { result, unmount } = renderHook(() => useImageUpload());

    await act(async () => {
      await result.current.seleccionarImagen(crearArchivo('a.jpg', 'image/jpeg', 1000));
    });

    unmount();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview-url');
  });
});

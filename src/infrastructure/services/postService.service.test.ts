import { postService } from './postService.service';
import axios from 'axios';

jest.mock('axios');
const mockedPost = axios.post as jest.MockedFunction<typeof axios.post>;

describe('postService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('createPost success', async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: { ok: true } } as any);
    const res: any = await postService.createPost({ titulo: 't', contenido: 'c' });
    expect(mockedPost).toHaveBeenCalledWith('/api/posteo', { titulo: 't', contenido: 'c' });
    expect(res.success).toBe(true);
  });

  it('createPost sends image metadata when present', async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: { ok: true } } as any);

    await postService.createPost({
      titulo: 't',
      contenido: 'c',
      imagen_url: 'https://res.cloudinary.com/demo/image/upload/v1/twitter-clone/posteos/1/x.webp',
      imagen_public_id: 'twitter-clone/posteos/1/x',
    });

    expect(mockedPost).toHaveBeenCalledWith('/api/posteo', {
      titulo: 't',
      contenido: 'c',
      imagen_url: 'https://res.cloudinary.com/demo/image/upload/v1/twitter-clone/posteos/1/x.webp',
      imagen_public_id: 'twitter-clone/posteos/1/x',
    });
  });

  it('createPost returns API error message on failure', async () => {
    mockedPost.mockRejectedValueOnce({ response: { data: { error: 'bad' } } });

    const res: any = await postService.createPost({ titulo: 't', contenido: 'c' });

    expect(res.success).toBe(false);
    expect(res.error).toBe('bad');
  });
});




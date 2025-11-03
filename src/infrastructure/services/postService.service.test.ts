import { postService } from './postService.service';
import axios, { AxiosError } from 'axios';

jest.mock('axios');
const mockedPost = axios.post as jest.MockedFunction<typeof axios.post>;

describe('postService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('createPost success', async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: { ok: true } } as any);
    const res: any = await postService.createPost({ titulo: 't', contenido: 'c', creador_id: 1 });
    expect(mockedPost).toHaveBeenCalledWith('/api/posteo', { titulo: 't', contenido: 'c', creador_id: 1 });
    expect(res.success).toBe(true);
  });

  it('createPost returns error message on failure', async () => {
    const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, { data: { error: 'bad' } } as any);
    mockedPost.mockRejectedValueOnce(err);
    const res: any = await postService.createPost({ titulo: 't', contenido: 'c', creador_id: 1 });
    expect(res.success).toBe(false);
    expect(res.error).toBe('Error al crear el posteo');
  });
});

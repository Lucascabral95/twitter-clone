import { postDetailService } from './postDetailService.service';
import axios, { AxiosError } from 'axios';

describe('postDetailService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns post data on success', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ status: 200, data: { result: [{ id: 1 }] } } as any);
    const res: any = await postDetailService.getPostById('1');
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ id: 1 });
  });

  it('returns not found message when empty', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ status: 200, data: { result: [] } } as any);
    const res: any = await postDetailService.getPostById('1');
    expect(res.success).toBe(false);
    expect(res.error).toBe('No se encontró el posteo.');
  });

  it('maps axios error statuses', async () => {
    const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, { status: 404, data: { error: 'not found' } } as any);
    jest.spyOn(axios, 'get').mockRejectedValueOnce(err);
    const res: any = await postDetailService.getPostById('1');
    expect(res.success).toBe(false);
    expect(res.error).toBe('not found');
  });
});

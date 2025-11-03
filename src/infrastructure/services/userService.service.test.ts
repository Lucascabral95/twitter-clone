import { userService } from './userService.service';
import axios, { AxiosError } from 'axios';

describe('userService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getUserById success returns data', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ status: 200, data: { result: [{ id: 1 }] } } as any);
    const res: any = await userService.getUserById(1);
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ id: 1 });
  });

  it('getUserById returns mapped error for 404', async () => {
    const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, { status: 404, data: { error: 'not' } } as any);
    jest.spyOn(axios, 'get').mockRejectedValueOnce(err);
    const res: any = await userService.getUserById(1);
    expect(res.success).toBe(false);
    expect(res.error).toBe('not');
  });
});

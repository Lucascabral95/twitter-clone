import { authService } from './authService.service';
import axios, { AxiosError } from 'axios';

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login success', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({ status: 200, data: {} } as any);
    const res: any = await authService.login({ email: 'a@a.com', password: '123' });
    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', { email: 'a@a.com', password: '123' });
    expect(res.success).toBe(true);
  });

  it('login error returns message', async () => {
    const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, { status: 400, data: { error: 'bad' } } as any);
    jest.spyOn(axios, 'post').mockRejectedValueOnce(err);
    const res: any = await authService.login({ email: 'a@a.com', password: '123' });
    expect(res.success).toBe(false);
    expect(res.error).toBe('bad');
  });

  it('register success', async () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({ status: 201, data: {} } as any);
    const res: any = await authService.register({ nombre: 'L', email: 'a@a.com', password: '12345678' });
    expect(axios.post).toHaveBeenCalledWith('/api/auth/register', { nombre: 'L', email: 'a@a.com', password: '12345678' });
    expect(res.success).toBe(true);
  });
});

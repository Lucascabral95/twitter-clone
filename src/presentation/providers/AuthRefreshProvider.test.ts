import React from 'react';
import { render } from '@testing-library/react';

const mockPost = jest.fn();
const mockAxiosCallable = jest.fn();
let responseErrorHandler: (error: unknown) => unknown;

jest.mock('axios', () => {
  const fn = jest.fn((...args: unknown[]) => mockAxiosCallable(...args));
  Object.assign(fn, {
    post: (...args: unknown[]) => mockPost(...args),
    interceptors: {
      response: {
        use: (_onFulfilled: unknown, onRejected: (error: unknown) => unknown) => {
          responseErrorHandler = onRejected;
        },
      },
    },
  });
  return { __esModule: true, default: fn };
});

import AuthRefreshProvider from './AuthRefreshProvider';

describe('AuthRefreshProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mount = () => render(React.createElement(AuthRefreshProvider, null, React.createElement('div')));

  it('registers a single response interceptor', () => {
    mount();

    expect(typeof responseErrorHandler).toBe('function');
  });

  it('ignores non-401 errors', async () => {
    mount();
    const error = { response: { status: 500 }, config: { url: '/api/posteo' } };

    await expect(responseErrorHandler(error)).rejects.toBe(error);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('does not attempt refresh for auth endpoints themselves', async () => {
    mount();
    const error = { response: { status: 401 }, config: { url: '/api/auth/login' } };

    await expect(responseErrorHandler(error)).rejects.toBe(error);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('refreshes and retries the original request once on a 401', async () => {
    mount();
    mockPost.mockResolvedValue({ status: 200 });
    mockAxiosCallable.mockResolvedValue({ status: 200, data: { result: 'ok' } });

    const originalRequest = { url: '/api/auth/datasesion' };
    const error = { response: { status: 401 }, config: originalRequest };

    const result = await responseErrorHandler(error);

    expect(mockPost).toHaveBeenCalledWith('/api/auth/refresh');
    expect(mockAxiosCallable).toHaveBeenCalledWith(expect.objectContaining({ _retry: true }));
    expect(result).toEqual({ status: 200, data: { result: 'ok' } });
  });

  it('does not retry a request more than once', async () => {
    mount();
    const originalRequest = { url: '/api/auth/datasesion', _retry: true };
    const error = { response: { status: 401 }, config: originalRequest };

    await expect(responseErrorHandler(error)).rejects.toBe(error);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('rejects without forcing navigation when the refresh token is invalid or missing', async () => {
    mount();
    mockPost.mockRejectedValue(new Error('refresh failed'));

    const originalRequest = { url: '/api/auth/datasesion' };
    const error = { response: { status: 401 }, config: originalRequest };

    await expect(responseErrorHandler(error)).rejects.toBe(error);
    expect(mockAxiosCallable).not.toHaveBeenCalled();
  });
});

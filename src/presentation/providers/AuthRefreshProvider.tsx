'use client';
import { useEffect } from 'react';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

let interceptorRegistered = false;
let refreshPromise: Promise<boolean> | null = null;

const shouldSkipRefresh = (url?: string): boolean =>
  !!url &&
  (url.includes('/api/auth/login') ||
    url.includes('/api/auth/register') ||
    url.includes('/api/auth/refresh'));

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const AuthRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    if (interceptorRegistered) return;
    interceptorRegistered = true;

    axios.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if (
          error.response?.status !== 401 ||
          !originalRequest ||
          originalRequest._retry ||
          shouldSkipRefresh(originalRequest.url)
        ) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!refreshPromise) {
          refreshPromise = axios
            .post('/api/auth/refresh')
            .then(() => true)
            .catch(() => false)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const refreshed = await refreshPromise;

        if (refreshed) {
          return axios(originalRequest);
        }

        // No valid refresh token (e.g. anonymous user or fully expired session):
        // let the original 401 propagate instead of forcing a redirect, since many
        // 401s here are passive "am I logged in?" checks on public pages.
        return Promise.reject(error);
      }
    );
  }, []);

  return <>{children}</>;
};

export default AuthRefreshProvider;

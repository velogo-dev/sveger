import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_CONSTANTS } from './constants';
import { requestInterceptor, responseInterceptor, errorInterceptor } from './interceptors';

export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

/**
 * Creates and configures an Axios instance
 */
export const createAxiosInstance = (config?: ApiConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config?.baseURL || API_CONSTANTS.DEFAULT_BASE_URL,
    timeout: config?.timeout || API_CONSTANTS.DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    withCredentials: config?.withCredentials ?? false,
  });

  // Apply interceptors
  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use(responseInterceptor, errorInterceptor);

  return instance;
};

/**
 * Default configured Axios instance
 */
export const apiClient = createAxiosInstance();

export type { AxiosInstance, AxiosRequestConfig, AxiosResponse };
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { handleApiError } from '../utils/error-handler';

/**
 * Request interceptor to add authentication and other headers
 */
export const requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  // Add authentication token if available
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add request timestamp
  if (config.headers) {
    config.headers['X-Request-Time'] = new Date().toISOString();
  }

  // Log request in development
  if (import.meta.env.NODE_ENV === 'development') {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
    });
  }

  return config;
};

/**
 * Response interceptor for successful responses
 */
export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Log response in development
  if (import.meta.env.NODE_ENV === 'development') {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
  }

  return response;
};

/**
 * Error interceptor for handling failed requests
 */
export const errorInterceptor = (error: AxiosError): Promise<never> => {
  // Log error in development
  if (import.meta.env.NODE_ENV === 'development') {
    console.error('❌ API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
  }

  // Handle different error types
  if (error.response?.status === 401) {
    // Handle unauthorized - clear token and redirect to login
    clearAuthToken();
    // You might want to redirect to login page here
    // window.location.href = '/login';
  }

  // Use centralized error handler
  return Promise.reject(handleApiError(error));
};

/**
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Clear authentication token from storage
 */
function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }
}
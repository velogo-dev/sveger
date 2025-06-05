import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

// User customizable configuration
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    response?: {
      success?: (response: AxiosResponse) => AxiosResponse;
      error?: (error: any) => Promise<any>;
    };
  };
  auth?: {
    type: 'bearer' | 'apikey' | 'basic' | 'custom';
    tokenKey?: string; // localStorage key for token
    headerName?: string; // custom header name for auth
    customAuth?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  };
}

// Default configuration - user can override this
export const defaultConfig: ApiClientConfig = {
  baseURL: 'https://api.example.com', // Will be replaced: {{BASE_URL}}
  timeout: 10000, // Will be replaced: {{TIMEOUT}}
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    type: 'bearer' as any, // Will be replaced: {{AUTH_TYPE}}
    tokenKey: 'auth_token', // Will be replaced: {{TOKEN_KEY}}
    headerName: 'X-API-Key', // Will be replaced: {{HEADER_NAME}}
  },
};

// Create axios instance with user configuration
export function createApiClient(userConfig?: Partial<ApiClientConfig>): AxiosInstance {
  const config = { ...defaultConfig, ...userConfig };
  
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: config.headers,
  });

  // Apply authentication interceptor
  if (config.auth) {
    client.interceptors.request.use((axiosConfig) => {
      if (config.auth?.customAuth) {
        return config.auth.customAuth(axiosConfig);
      }

      const tokenKey = config.auth.tokenKey || 'auth_token';
      const token = localStorage.getItem(tokenKey);

      if (token && axiosConfig.headers) {
        switch (config.auth.type) {
          case 'bearer':
            axiosConfig.headers.Authorization = `Bearer ${token}`;
            break;
          case 'apikey':
            const headerName = config.auth.headerName || 'X-API-Key';
            axiosConfig.headers[headerName] = token;
            break;
          case 'basic':
            const password = localStorage.getItem('auth_password') || '';
            const credentials = btoa(`${token}:${password}`);
            axiosConfig.headers.Authorization = `Basic ${credentials}`;
            break;
        }
      }

      return config.interceptors?.request ? config.interceptors.request(axiosConfig) : axiosConfig;
    });
  }

  // Apply response interceptors
  client.interceptors.response.use(
    (response) => {
      return config.interceptors?.response?.success ? config.interceptors.response.success(response) : response;
    },
    (error) => {
      // Handle 401 errors
      if (error.response?.status === 401 && config.auth) {
        const tokenKey = config.auth.tokenKey || 'auth_token';
        localStorage.removeItem(tokenKey);
        if (config.auth.type === 'basic') {
          localStorage.removeItem('auth_password');
        }
        console.warn('Unauthorized access - please login again');
      }

      return config.interceptors?.response?.error ? config.interceptors.response.error(error) : Promise.reject(error);
    }
  );

  return client;
}

// Global instance - users can customize this
export const apiClient = createApiClient();

// Helper functions for different auth types
export const auth = {
  setBearerToken: (token: string, key = 'auth_token') => {
    localStorage.setItem(key, token);
  },
  
  setApiKey: (apiKey: string, key = 'api_key') => {
    localStorage.setItem(key, apiKey);
  },
  
  setBasicAuth: (username: string, password: string, usernameKey = 'auth_token', passwordKey = 'auth_password') => {
    localStorage.setItem(usernameKey, username);
    localStorage.setItem(passwordKey, password);
  },
  
  removeAuth: (keys: string[] = ['auth_token', 'api_key', 'auth_password']) => {
    keys.forEach(key => localStorage.removeItem(key));
  },
};

// Configuration helpers
export const setBaseURL = (url: string) => {
  apiClient.defaults.baseURL = url;
};

export const setTimeout = (timeoutMs: number) => {
  apiClient.defaults.timeout = timeoutMs;
};

export const setHeaders = (headers: Record<string, string>) => {
  Object.assign(apiClient.defaults.headers, headers);
};
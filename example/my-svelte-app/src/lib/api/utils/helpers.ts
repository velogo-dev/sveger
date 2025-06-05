import type { AxiosRequestConfig } from 'axios';
import { cleanQueryParams, type QueryParams } from './query-builder';

/**
 * Merges multiple configuration objects
 */
export const mergeConfigs = (...configs: (AxiosRequestConfig | undefined)[]): AxiosRequestConfig => {
  const merged: AxiosRequestConfig = {};

  configs.forEach(config => {
    if (config) {
      Object.assign(merged, config);
      
      // Merge headers separately to avoid overwriting
      if (config.headers) {
        merged.headers = { ...merged.headers, ...config.headers };
      }
      
      // Merge params separately
      if (config.params) {
        merged.params = { ...merged.params, ...config.params };
      }
    }
  });

  return merged;
};

/**
 * Creates a request configuration with query parameters
 */
export const createRequestConfig = (
  params?: QueryParams,
  config?: AxiosRequestConfig
): AxiosRequestConfig => {
  const baseConfig: AxiosRequestConfig = { ...config };
  
  if (params) {
    baseConfig.params = { ...baseConfig.params, ...cleanQueryParams(params) };
  }
  
  return baseConfig;
};

/**
 * Replaces path parameters in a URL template
 */
export const replacePath = (pathTemplate: string, pathParams: Record<string, any>): string => {
  let path = pathTemplate;
  
  Object.entries(pathParams).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    path = path.replace(placeholder, encodeURIComponent(String(value)));
  });
  
  return path;
};

/**
 * Validates that all required path parameters are provided
 */
export const validatePathParams = (pathTemplate: string, pathParams: Record<string, any>): void => {
  const requiredParams = pathTemplate.match(/{(\w+)}/g);
  
  if (requiredParams) {
    const missingParams = requiredParams
      .map(param => param.slice(1, -1)) // Remove { and }
      .filter(param => pathParams[param] === undefined || pathParams[param] === null);
    
    if (missingParams.length > 0) {
      throw new Error(`Missing required path parameters: ${missingParams.join(', ')}`);
    }
  }
};

/**
 * Creates a FormData object from an object
 */
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(item => formData.append(`${key}[]`, String(item)));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
};

/**
 * Delays execution for specified milliseconds
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delayMs = baseDelay * Math.pow(2, attempt);
      await delay(delayMs);
    }
  }
  
  throw lastError!;
};

/**
 * Debounces a function call
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttles a function call
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
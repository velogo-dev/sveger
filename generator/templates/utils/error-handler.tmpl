import { AxiosError } from 'axios';
import { API_CONSTANTS } from '../config/constants';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  timestamp: string;
}

/**
 * Handles API errors and transforms them into a consistent format
 */
export const handleApiError = (error: AxiosError): ApiError => {
  const timestamp = new Date().toISOString();

  // Network error (no response)
  if (!error.response) {
    return {
      message: error.code === 'ECONNABORTED' 
        ? API_CONSTANTS.ERROR_MESSAGES.TIMEOUT_ERROR
        : API_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR,
      code: error.code,
      timestamp,
    };
  }

  const { status, data } = error.response;

  // Extract error message from response
  let message = API_CONSTANTS.ERROR_MESSAGES.UNKNOWN_ERROR;
  if (typeof data === 'object' && data) {
    message = data.message || data.error || data.detail || message;
  } else if (typeof data === 'string') {
    message = data;
  }

  // Map status codes to user-friendly messages
  switch (status) {
    case API_CONSTANTS.STATUS_CODES.UNAUTHORIZED:
      message = API_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case API_CONSTANTS.STATUS_CODES.FORBIDDEN:
      message = API_CONSTANTS.ERROR_MESSAGES.FORBIDDEN;
      break;
    case API_CONSTANTS.STATUS_CODES.NOT_FOUND:
      message = API_CONSTANTS.ERROR_MESSAGES.NOT_FOUND;
      break;
    case API_CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR:
    case API_CONSTANTS.STATUS_CODES.BAD_GATEWAY:
    case API_CONSTANTS.STATUS_CODES.SERVICE_UNAVAILABLE:
      message = API_CONSTANTS.ERROR_MESSAGES.SERVER_ERROR;
      break;
  }

  return {
    message,
    status,
    code: error.code,
    details: data,
    timestamp,
  };
};

/**
 * Creates a custom API error
 */
export const createApiError = (
  message: string,
  status?: number,
  code?: string,
  details?: any
): ApiError => ({
  message,
  status,
  code,
  details,
  timestamp: new Date().toISOString(),
});

/**
 * Checks if an error is an API error
 */
export const isApiError = (error: any): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'timestamp' in error
  );
};

/**
 * Error handler utility for async operations
 */
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Operation failed:', error.message);
    }
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw error;
  }
};
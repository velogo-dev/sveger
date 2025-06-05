/**
 * API Constants and Configuration
 */
export const API_CONSTANTS = {
  // Base configuration
  DEFAULT_BASE_URL: 'https://api.example.com',
  DEFAULT_TIMEOUT: 10000,
  
  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  } as const,

  // Content Types
  CONTENT_TYPES: {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    URL_ENCODED: 'application/x-www-form-urlencoded',
    TEXT: 'text/plain',
  } as const,

  // Auth Types
  AUTH_TYPES: {
    BEARER: 'Bearer',
    BASIC: 'Basic',
    API_KEY: 'ApiKey',
  } as const,

  // Header Names
  HEADERS: {
    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
    ACCEPT: 'Accept',
    X_API_KEY: 'X-API-Key',
    X_REQUEST_ID: 'X-Request-ID',
    X_REQUEST_TIME: 'X-Request-Time',
  } as const,

  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',
    UNAUTHORIZED: 'Authentication required. Please log in.',
    FORBIDDEN: 'Access denied. You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Internal server error. Please try again later.',
    UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
  } as const,
} as const;

export type StatusCode = typeof API_CONSTANTS.STATUS_CODES[keyof typeof API_CONSTANTS.STATUS_CODES];
export type ContentType = typeof API_CONSTANTS.CONTENT_TYPES[keyof typeof API_CONSTANTS.CONTENT_TYPES];
export type AuthType = typeof API_CONSTANTS.AUTH_TYPES[keyof typeof API_CONSTANTS.AUTH_TYPES];
/**
 * Common types used across the API
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
  timestamp?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationError[];
}

// Common query parameters
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  per_page?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  order_by?: string;
  search?: string;
  q?: string;
}

// File upload related types
export interface FileUploadResponse {
  file_id: string;
  filename: string;
  size: number;
  mime_type: string;
  url: string;
  uploaded_at: string;
}

export interface FileUploadRequest {
  file: File;
  description?: string;
  tags?: string[];
}

// Common field types
export type ID = string | number;
export type Timestamp = string; // ISO 8601 format
export type Email = string;
export type URL = string;
export type UUID = string;

// Status enums
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

// Generic utility types
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Date range type
export interface DateRange {
  start_date?: Timestamp;
  end_date?: Timestamp;
}

// Audit fields
export interface AuditFields {
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by?: ID;
  updated_by?: ID;
}
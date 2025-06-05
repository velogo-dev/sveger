/**
 * Query parameter building utilities
 */

export interface QueryParams {
  [key: string]: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  per_page?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  order_by?: string;
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

/**
 * Builds query parameters for API requests
 */
export class QueryBuilder {
  private params: QueryParams = {};

  /**
   * Add pagination parameters
   */
  paginate(pagination: PaginationParams): QueryBuilder {
    Object.entries(pagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.params[key] = value;
      }
    });
    return this;
  }

  /**
   * Add sorting parameters
   */
  sort(sort: SortParams): QueryBuilder {
    Object.entries(sort).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.params[key] = value;
      }
    });
    return this;
  }

  /**
   * Add filter parameters
   */
  filter(filters: FilterParams): QueryBuilder {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle arrays
        if (Array.isArray(value)) {
          this.params[key] = value.join(',');
        } else {
          this.params[key] = value;
        }
      }
    });
    return this;
  }

  /**
   * Add a single parameter
   */
  add(key: string, value: any): QueryBuilder {
    if (value !== undefined && value !== null) {
      this.params[key] = value;
    }
    return this;
  }

  /**
   * Add a single parameter (alias for add)
   */
  param(key: string, value: any): QueryBuilder {
    return this.add(key, value);
  }

  /**
   * Add multiple parameters
   */
  addParams(params: QueryParams): QueryBuilder {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.params[key] = value;
      }
    });
    return this;
  }

  /**
   * Add an array parameter
   */
  addArray(key: string, values: any[]): QueryBuilder {
    if (values && values.length > 0) {
      this.params[key] = values.join(',');
    }
    return this;
  }

  /**
   * Add a boolean parameter
   */
  addBoolean(key: string, value: boolean): QueryBuilder {
    if (value !== undefined && value !== null) {
      this.params[key] = value.toString();
    }
    return this;
  }

  /**
   * Build the final query parameters object
   */
  build(): QueryParams {
    return { ...this.params };
  }

  /**
   * Reset the query builder
   */
  reset(): QueryBuilder {
    this.params = {};
    return this;
  }
}

/**
 * Create a new query builder instance
 */
export const createQueryBuilder = (): QueryBuilder => new QueryBuilder();

/**
 * Utility function to clean undefined/null values from query params
 */
export const cleanQueryParams = (params: QueryParams): QueryParams => {
  const cleaned: QueryParams = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Convert arrays to comma-separated strings
      if (Array.isArray(value)) {
        cleaned[key] = value.join(',');
      } else {
        cleaned[key] = value;
      }
    }
  });

  return cleaned;
};

/**
 * Build URL search params from query object
 */
export const buildSearchParams = (params: QueryParams): URLSearchParams => {
  const searchParams = new URLSearchParams();
  
  Object.entries(cleanQueryParams(params)).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });

  return searchParams;
};
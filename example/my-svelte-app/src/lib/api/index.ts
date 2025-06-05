// ===== MAIN API INDEX =====
// Auto-generated API client exports

// Configuration
import { createAxiosInstance } from './config/axios.config';
import type { ApiConfig, AxiosInstance } from './config/axios.config';
export { createAxiosInstance, apiClient } from './config/axios.config';
export { API_CONSTANTS } from './config/constants';
export type { ApiConfig };

// Types
export * from './types/index';

// Utils
export { handleApiError, createApiError, isApiError, withErrorHandling } from './utils/error-handler';
export { QueryBuilder, createQueryBuilder, cleanQueryParams, buildSearchParams } from './utils/query-builder';
export { mergeConfigs, createRequestConfig, replacePath, validatePathParams, createFormData, delay, retryWithBackoff, debounce, throttle } from './utils/helpers';

// Resource API Clients
import { CompanyApiClient, companyApi } from './resources/company/company-api.client';
import { PetApiClient, petApi } from './resources/pet/pet-api.client';
import { StoreApiClient, storeApi } from './resources/store/store-api.client';
import { UserApiClient, userApi } from './resources/user/user-api.client';

export { CompanyApiClient, companyApi };
export { PetApiClient, petApi };
export { StoreApiClient, storeApi };
export { UserApiClient, userApi };


// Create a unified API client that includes all resources
export class ApiClient {
  readonly company: CompanyApiClient;
  readonly pet: PetApiClient;
  readonly store: StoreApiClient;
  readonly user: UserApiClient;


  constructor(configOrClient?: ApiConfig | AxiosInstance) {
    let client: AxiosInstance;
    
    if (configOrClient) {
      // Check if it's an AxiosInstance or config object
      if ('request' in configOrClient && 'get' in configOrClient) {
        // It's an AxiosInstance
        client = configOrClient;
      } else {
        // It's an ApiConfig object
        client = createAxiosInstance(configOrClient as ApiConfig);
      }
      this.company = new CompanyApiClient(client);
      this.pet = new PetApiClient(client);
      this.store = new StoreApiClient(client);
      this.user = new UserApiClient(client);
    } else {
      this.company = companyApi;
      this.pet = petApi;
      this.store = storeApi;
      this.user = userApi;
    }
  }
}

/**
 * Default unified API client instance
 */
export const api = new ApiClient();
import type { AxiosInstance } from 'axios';
import { apiClient } from '../../config/axios.config';

// Import all operations for this resource
import { getApiV1CompanyList } from './operations/get-api-v1-company-list';


/**
 * Company API Client
 * Contains all operations related to Company
 */
export class CompanyApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance = apiClient) {
    this.client = client;
  }

  // Resource operations
  get getApiV1CompanyList() { return getApiV1CompanyList(this.client); }

}

/**
 * Default Company API client instance
 */
export const companyApi = new CompanyApiClient();
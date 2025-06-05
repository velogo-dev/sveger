import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

export interface findPetsByStatusQuery {
  /** Status values that need to be considered for filter */
  status?: any[];
}

/**
 * @description Finds Pets by status
 * @tags pet
 * @name findPetsByStatus
 * @summary Finds Pets by status
 * @request GET:/pet/findByStatus
 */
export const findPetsByStatus = (client: AxiosInstance) => async (
  query?: findPetsByStatusQuery,
  config?: AxiosRequestConfig,
): Promise<Types.Pet[]> => {
  return withErrorHandling(async () => {
    const url = '/pet/findByStatus';

    // Create request configuration with query parameters
    const requestConfig = createRequestConfig(query, config);

    // Make the API request
    const response = await client.get<Types.Pet[]>(
      url,
      requestConfig,
    );

    return response.data;
  });
};
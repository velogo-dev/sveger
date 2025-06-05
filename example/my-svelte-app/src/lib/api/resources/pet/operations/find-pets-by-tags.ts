import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

export interface findPetsByTagsQuery {
  /** Tags to filter by */
  tags?: any[];
}

/**
 * @description Finds Pets by tags
 * @tags pet
 * @name findPetsByTags
 * @summary Finds Pets by tags
 * @request GET:/pet/findByTags
 */
export const findPetsByTags = (client: AxiosInstance) => async (
  query?: findPetsByTagsQuery,
  config?: AxiosRequestConfig,
): Promise<Types.Pet[]> => {
  return withErrorHandling(async () => {
    const url = '/pet/findByTags';

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
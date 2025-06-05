import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Update an existing pet
 * @tags pet
 * @name updatePet
 * @summary Update an existing pet
 * @request PUT:/pet
 */
export const updatePet = (client: AxiosInstance) => async (
  data: Types.Pet,
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    const url = '/pet';

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.put<any>(
      url,
      data,
      requestConfig,
    );

    return response.data;
  });
};
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Add a new pet to the store
 * @tags pet
 * @name addPet
 * @summary Add a new pet to the store
 * @request POST:/pet
 */
export const addPet = (client: AxiosInstance) => async (
  data: Types.Pet,
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    const url = '/pet';

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.post<any>(
      url,
      data,
      requestConfig,
    );

    return response.data;
  });
};
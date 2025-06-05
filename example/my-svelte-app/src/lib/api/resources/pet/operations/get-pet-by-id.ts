import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig, replacePath, validatePathParams } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Find pet by ID
 * @tags pet
 * @name getPetById
 * @summary Find pet by ID
 * @request GET:/pet/{petId}
 */
export const getPetById = (client: AxiosInstance) => async (petId: number,
  config?: AxiosRequestConfig,
): Promise<Types.Pet> => {
  return withErrorHandling(async () => {
    // Validate path parameters
    const pathParams = { petId };
    validatePathParams('/pet/{petId}', pathParams);
    
    // Replace path parameters
    const url = replacePath('/pet/{petId}', pathParams);

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.get<Types.Pet>(
      url,
      requestConfig,
    );

    return response.data;
  });
};
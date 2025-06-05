import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig, replacePath, validatePathParams } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description Updates a pet in the store with form data
 * @tags pet
 * @name updatePetWithForm
 * @summary Updates a pet in the store with form data
 * @request POST:/pet/{petId}
 */
export const updatePetWithForm = (client: AxiosInstance) => async (petId: number,
  config?: AxiosRequestConfig,
): Promise<any> => {
  return withErrorHandling(async () => {
    // Validate path parameters
    const pathParams = { petId };
    validatePathParams('/pet/{petId}', pathParams);
    
    // Replace path parameters
    const url = replacePath('/pet/{petId}', pathParams);

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.post<any>(
      url,
      requestConfig,
    );

    return response.data;
  });
};
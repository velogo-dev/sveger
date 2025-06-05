import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createRequestConfig, replacePath, validatePathParams } from '../../../utils/helpers';
import { withErrorHandling } from '../../../utils/error-handler';
import * as Types from '../../../types/index';

/**
 * @description uploads an image
 * @tags pet
 * @name uploadFile
 * @summary uploads an image
 * @request POST:/pet/{petId}/uploadImage
 */
export const uploadFile = (client: AxiosInstance) => async (petId: number,
  config?: AxiosRequestConfig,
): Promise<Types.ApiResponse> => {
  return withErrorHandling(async () => {
    // Validate path parameters
    const pathParams = { petId };
    validatePathParams('/pet/{petId}/uploadImage', pathParams);
    
    // Replace path parameters
    const url = replacePath('/pet/{petId}/uploadImage', pathParams);

    const requestConfig = createRequestConfig(undefined, config);

    // Make the API request
    const response = await client.post<Types.ApiResponse>(
      url,
      requestConfig,
    );

    return response.data;
  });
};